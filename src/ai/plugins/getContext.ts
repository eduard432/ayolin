import { tool } from 'ai'
import { z } from 'zod'

export const getContextSettings = {
	bookId: '',
}

const getContext = async (query: string, settings: typeof getContextSettings) => {
	const resp = await fetch(
		`/api/books/search/${settings.bookId}?${new URLSearchParams({
			q: query,
		})}`
	)
	const { context }: { context: string } = await resp.json()


	return context
}

export function generateGetContextTool(settings: typeof getContextSettings) {
	return tool({
		description: 'Busca el contenido/contexto del libro previamente enviado',
		parameters: z.object({
			query: z.string().describe('La consulta para buscar información en el libro'),
		}),
		execute: ({ query }) => getContext(query, settings),
		type: 'function',
	})
}
