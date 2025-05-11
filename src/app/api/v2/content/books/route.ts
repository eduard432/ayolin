import { generateMd } from '@/ai/utils/books'
import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { chunk } from '@/lib/utils'
import { BookChunkDb, BookDb } from '@/types/Books'
import { openai } from '@ai-sdk/openai'
import { embedMany } from 'ai'
import { Db, ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const IMAGE_URL = (publicId: string, page: number = 1) =>
	`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/pg_${page}/q_auto/${publicId}.jpeg`

const preLoadImages = async (publicId: string, pages: number) => {
	const imageRequests = Array.from({ length: pages }, (_, p) =>
		fetch(IMAGE_URL(publicId, p + 1))
	)

	const imageChunkRequests = chunk(imageRequests, 10)

	await Promise.all(imageChunkRequests.map(async (chunk, i) => {
		const results = await Promise.allSettled(chunk);
		results.forEach((result, index) => {
			if (result.status === "rejected") {
				console.log(`⚠️ Error cargando imagen ${i * 10 + index + 1}:`, result.reason);
			}
		});
	}));
}

const getCunks = async (publicId: string, pages: number) => {
	let chunks: { content: string; page: number }[] = []
	let totalPricing = 0

	for (let i = 1; i <= pages; i++) {
		console.log(IMAGE_URL(publicId, i))
		const { text, pricing } = await generateMd(IMAGE_URL(publicId, i), {
			model: 'gpt-4o-mini',
			pricing: [0.15, 0.6],
			prevPage: chunks.length > 0 ? chunks[i - 2].content : undefined,
		})
		const subChunks = text.split('%---%')
		chunks.push(
			...subChunks.map((text) => ({
				content: text,
				page: i,
			}))
		)
		totalPricing += pricing
	}

	const PESO_MXN = 20.55
	console.log(`-------------------------------
		Total Cost: $${totalPricing} - $MXN ${totalPricing * PESO_MXN * 1.03}`)

	return chunks
}

const saveEmbeddings = async (bookChunks: BookChunkDb[], db: Db) => {
	const embeddingCollection = db.collection<BookChunkDb>('book_chunks')
	const result = await embeddingCollection.insertMany(bookChunks)

	return result
}

const processBook = async (
	bookId: ObjectId,
	publicId: string,
	pages: number,
	fileName: string
) => {
	const resend = new Resend(process.env.RESEND_TOKEN)
	try {
		// Preload PDF Images:
		await preLoadImages(publicId, pages)

		const chunks = (await getCunks(publicId, pages)).filter((e) => e)

		const { embeddings } = await embedMany({
			model: openai.embedding('text-embedding-3-large'),
			values: chunks.map((chunk) => chunk.content),
		})

		const bookChunks = embeddings.map((embedding, i) => ({
			...chunks[i],
			embedding,
			bookId,
			chunk: i,
			sBookId: bookId.toString()
		}))

		const db = await getDatabase()

		const embeddingResult = await saveEmbeddings(bookChunks, db)

		const bookCollection = db.collection<BookDb>('books')

		const result = await bookCollection.insertOne({
			_id: bookId,
			pages,
			name: fileName,
			bookChunks: Object.values(embeddingResult.insertedIds),
			chunks: chunks.length,
			status: 'ready',
		})

		if (result.insertedId) {
			await resend.emails.send({
				from: 'Acme <onboarding@resend.dev>',
				to: ['juantokx@gmail.com'],
				subject: 'Vectorizado de PDF terminado',
				html: `<p>Tu archivo <strong>${fileName}.pdf</strong> ha terminado de vectorizarse, id: <strong>${bookId}</strong> </p>`,
			})
		} else throw Error('Server error')
	} catch (error) {
		console.log(error)
		await resend.emails.send({
			from: 'Acme <onboarding@resend.dev>',
			to: ['juantokx@gmail.com'],
			subject: 'Vectorizado de PDF ha fallado',
			html: `<p>Tu archivo <strong>${fileName}.pdf</strong> tuvo un error al vectorizarse, id: <strong>${bookId}</strong> </p>`,
		})
	}
}

const bodySchema = z.object({
    pages: z.number().min(1),
    cloudinaryId: z.string(),
    fileName: z.string(),
})

export async function POST(request: NextRequest) {
	try {

        const body = await request.json()
        const { pages, cloudinaryId, fileName } = validateWithSource(body, bodySchema, 'body')

		const bookId = new ObjectId()

		processBook(bookId, cloudinaryId, pages, fileName)

		return NextResponse.json({
			msg: 'Processing book... you will notified at your email',
			bookId: bookId,
		})
	} catch (error) {
        handleApiError(error)
    }
}
