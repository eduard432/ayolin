import { generateMd } from '@/ai/utils/books';
import { uploadFile } from '@/lib/cloudinary';
import { getDatabase } from '@/lib/db';
import { BookChunkDb, BookDb } from '@/types/Books';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import { Db, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib';
import { Resend } from 'resend';

const IMAGE_URL = (publicId: string, page: number = 1) =>
	`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/pg_${page}/q_auto/${publicId}.jpeg`

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

const processBook = async (buffer: string | Buffer, bookId: ObjectId, fileName: string) => {
	const pdfDoc = await PDFDocument.load(buffer)
	const pages = pdfDoc.getPageCount()		

	const publicId = await uploadFile(buffer, 'application/pdf')

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
		
		const resend = new Resend(process.env.RESEND_TOKEN)

		await resend.emails.send({
			from: 'Acme <onboarding@resend.dev>',
			to: ['juantokx@gmail.com'],
			subject: 'Vectorizado de PDF terminado',
			html: `<p>Tu archivo <strong>${fileName}.pdf</strong> ha terminado de vectorizarse, id: <strong>${bookId}</strong> </p>`,
		})

		
	} else throw Error('Server error')
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData() // Extrae el FormData del request
		const file = formData.get('file') as File | null

		if (!file) {
			return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
		}

		// Validar la extensión y el tipo MIME
		if (!file.name.endsWith('.pdf') || file.type !== 'application/pdf') {
			return NextResponse.json(
				{ error: 'Solo se permiten archivos PDF' },
				{ status: 400 }
			)
		}
		

		// Leer el contenido del archivo
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		const bookId = new ObjectId()

		processBook(buffer, bookId, file.name)

		return NextResponse.json({
			msg: 'Processing book... you will notified at your email',
			bookId: bookId
		})

	} catch (error) {}
}
