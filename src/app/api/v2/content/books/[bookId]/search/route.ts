import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { BookChunkDb, BookDb } from '@/types/Books'
import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
	q: z.string(),
})

const paramsSchema = z.object({
	bookId: z.string(),
})

export async function GET(
	request: NextRequest,
	{ params: paramsPromise }: { params: Promise<{ bookId: string }> }
) {
	try {
		const params = await paramsPromise
		const { bookId } = validateWithSource(paramsSchema, params, 'params')

		const query = Object.fromEntries(request.nextUrl.searchParams.entries())
		const { q } = validateWithSource(querySchema, query, 'query')

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
							sBookId: bookId,
						},
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
		return handleApiError(error)
	}
}
