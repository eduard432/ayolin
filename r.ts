import dotenv from 'dotenv'
import { CoreMessage, Embedding, embedMany, generateText, Message } from 'ai'
import { openai } from '@ai-sdk/openai'
import { cloudinary } from './cloudinary'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs/promises'
import { connectToDatabase, getDatabase } from './mongodb'
import { ObjectId } from 'mongodb'
import { Resend } from 'resend'

dotenv.config()
const PESO_MXN = 20.55

const generateMd = async (
	imageUrl: string,
	config: {
		model: string
		prevPage?: string
		pricing: number[]
	}
) => {
	const { model, prevPage, pricing } = config

	const messages: CoreMessage[] | Omit<Message, 'id'>[] | undefined = [
		{
			role: 'system',
			content: `Eres una asistente que convierte imagenes a texto markdown para un RAG, tienes que escribir TEXTUALMENTE lo que dice el documento, 
			sin realizar ningún tipo de inferencia. También escribe las tablas o graficas que veas, no pongas imágenes, ni de logotipos
			ni de ningun otro tipo. No omitas informacion. Devuelve el markdown inmediatamente listo para renderizarse.
			Separa con %---% para dividir un concepto/chunk de información dentro de la misma página (usa solo uno para dividir). 
			`,
		},
		{
			role: 'user',
			content: [
				{
					type: 'image',
					image: imageUrl,
				},
				{
					type: 'text',
					text: 'Convierte esta imágen a markdown sin omitir informacion',
				},
			],
		},
	]

	if (prevPage) {
		messages.push({
			role: 'system',
			content: `Pagina previa: \n${prevPage}`,
		})
	}

	const { text, usage } = await generateText({
		model: openai(model),
		messages,
	})

	const { promptTokens, completionTokens } = usage
	const input = (promptTokens * pricing[0]) / 1e6
	const output = (completionTokens * pricing[1]) / 1e6

	console.log(
		`${model}
		--------------------------- 
		Input: ${promptTokens} tokens - $${input}
		Output: ${completionTokens} tokens - $${output}
		Total: $${input + output} - $MXN ${(input + output) * PESO_MXN * 1.02}
		`
	)

	return { text, pricing: input + output }
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

	console.log(`-------------------------------
		Total Cost: $${totalPricing} - $MXN ${totalPricing * PESO_MXN * 1.03}`)

	await fs.writeFile('chunks.json', JSON.stringify(chunks, null, 2))

	return chunks
}

const uploadFile = async (data: string, mimetype = 'image/png') => {
	try {
		const result = await cloudinary.uploader.upload(
			`data:${mimetype};base64,${data}`
		)

		return result.public_id
	} catch (error) {
		console.log(error)
		return ''
	}
}

type BookPages = {
	content: string
	embedding: Embedding
	page: number
	bookId: ObjectId
	chunk: number
}

type Book = {
	bookPages: ObjectId[]
	name: string
	pages: number
	chunks: number
	status: 'pending' | 'ready'
}

const saveEmbeddings = async (booksPages: BookPages[]) => {
	const db = getDatabase()
	const embeddingCollection = db.collection<BookPages>('books_pages')
	const result = await embeddingCollection.insertMany(booksPages)

	return result
}

const IMAGE_URL = (publicId: string, page: number = 1) =>
	`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/pg_${page}/q_auto/${publicId}.jpeg`

;(async () => {
	await connectToDatabase()

	const fileName = 'file'

	const pdfBytes = await fs.readFile(`${fileName}.pdf`, 'base64')
	const pdfDoc = await PDFDocument.load(pdfBytes)
	const pages = pdfDoc.getPageCount()

	const publicId = await uploadFile(pdfBytes, 'application/pdf')

	// const publicId = 'b5xspj1rg16lm8i90ziz'

	const chunks = (await getCunks(publicId, pages)).filter((e) => e)
	// const chunkFile = await fs.readFile('chunks.json', 'utf-8')
	// const chunks: {
	// 	content: string
	// 	page: number
	// }[] = await JSON.parse(chunkFile)

	const { embeddings } = await embedMany({
		model: openai.embedding('text-embedding-3-large'),
		values: chunks.map((chunk) => chunk.content),
	})

	const bookId = new ObjectId()

	const bookPages = embeddings.map((embedding, i) => ({
		...chunks[i],
		embedding,
		bookId,
		chunk: i,
	}))

	const embeddingResult = await saveEmbeddings(bookPages)

	const db = getDatabase()
	const bookCollection = db.collection<Book>('books')

	const result = await bookCollection.insertOne({
		_id: bookId,
		pages,
		name: fileName,
		bookPages: Object.values(embeddingResult.insertedIds),
		chunks: chunks.length,
		status: 'ready',
	})

	if (result.insertedId) {
		console.log('finish')
		const resend = new Resend(process.env.RESEND_TOKEN)

		await resend.emails.send({
			from: 'Acme <onboarding@resend.dev>',
			to: ['juantokx@gmail.com'],
			subject: 'Vectorizado de PDF terminado',
			html: `<p>Tu archivo <strong>${fileName}.pdf</strong> ha terminado de vectorizarse, id: <strong>${bookId}</strong> </p>`,
		})
	}
})()

import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()


cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECREY_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

export {
    cloudinary
}