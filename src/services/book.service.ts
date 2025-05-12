import { getDatabase } from '@/lib/db'
import { BookChunkDb, BookDb } from '@/types/Books'
import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'

export const searchInBook = async (bookId: string, q: string) => {
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

	if (results.length === 0) {
		return '[No results found]'
	}
	let context = ''

	for (let i = 0; i < results.length; i++) {
		const result = results[i]

		context += `Page:${result.page} \n ${result.content} \n\n\n`
	}

	return context
}
