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

		const bookObjectId = new ObjectId(id)

		const db = await getDatabase()
		const bookChunksCollection = db.collection<BookDb>('book_chunks')

		const { embedding } = await embed({
			model: openai.embedding('text-embedding-3-large'),
			value: q,
		})

		const results: BookChunkDb[] = await bookChunksCollection
			.aggregate<BookChunkDb>([
				{
					$match: {
						bookId: bookObjectId,
					},
				},
				{
					$vectorSearch: {
						index: 'embedding_index',
						path: 'embedding',
						queryVector: embedding,
						numCandidates: 100,
						limit: 5,
					},
				},
			])
			.toArray()

		return {
			results,
		}
	} catch (error) {
		console.log(error)
	}
}
