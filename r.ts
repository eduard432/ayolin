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

