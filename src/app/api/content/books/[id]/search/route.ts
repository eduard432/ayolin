import { getDatabase } from '@/lib/db'
import { BookChunkDb, BookDb } from '@/types/Books'
import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const q = request.nextUrl.searchParams.get('q')

		if (!q) throw Error('Missing query...')

		const db = await getDatabase()
		const bookChunksCollection = db.collection<BookDb>('book_chunks')

		const { embedding } = await embed({
			model: openai.embedding('text-embedding-3-large'),
			value: q,
		})

		const results: BookChunkDb[] = await bookChunksCollection
			.aggregate<BookChunkDb>([
				{
					$vectorSearch: {
						index: 'embedding_index',
						path: 'embedding',
						queryVector: embedding,
						numCandidates: 100,
						limit: 5,
						filter: {
							sBookId: id
						}
					},
				},
			])
			.toArray()

		let context = ''

		for (let i = 0; i < results.length; i++) {
			const result = results[i]

			context += `Page:${result.page} \n ${result.content} \n\n\n`
		}

		return Response.json({
			context,
		})
	} catch (error) {
		console.log(error)
		return Response.json(
			{
				msg: 'error',
			},
			{
				status: 500,
			}
		)
	}
}
