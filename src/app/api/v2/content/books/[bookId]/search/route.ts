import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { searchInBook } from '@/services/book.service'
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

		const context = await searchInBook(bookId, q)

		return Response.json({
			context,
		})
	} catch (error) {
		return handleApiError(error)
	}
}
