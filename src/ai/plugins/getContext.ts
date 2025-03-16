import { tool } from 'ai'
import { z } from 'zod'

export const getContextSettings = {
	bookId: '',
}

const getContext = async (query: string, settings: typeof getContextSettings) => {
	try {
		const params = new URLSearchParams();
		params.append('q', 'LA RESPONSABILIDAD DE UN LÍDER: DESARROLLO DE TEAMMATE');
		const baseURL = process.env.BASE_URL || 'http://localhost:3000'
		const url = `${baseURL}/api/books/${settings.bookId}/search?${params.toString()}`
		const resp = await fetch(url)

		const { context }: { context: string } = await resp.json()
		return context
	} catch (error) {
		console.log(error)
		return 'Error loading pdf...'
	}
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
