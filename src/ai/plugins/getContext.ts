import { tool } from 'ai'
import { z } from 'zod'

export const getContextSettings = {
	url: '',
}

const getContext = async (query: string, settings: typeof getContextSettings) => {
	const resp = await fetch(
		`${settings.url}/context?${new URLSearchParams({
			query,
		})}`
	)
	const { context }: { context: string } = await resp.json()

    console.log({context})

    return context
}

export function generateGetContextTool(settings: typeof getContextSettings) {
    return tool({
        description: 'Busca texto del libro: "EL MANIFIESTO COMUNISTA"',
        parameters: z.object({
            query: z.string().describe('La consulta para buscar información en el libro')
        }),
        execute: ({query}) => getContext(query, settings),
        type: 'function'
    })
}