import { openai } from '@ai-sdk/openai'
import { CoreMessage, Embedding, embedMany, generateText, Message } from 'ai'

export const generateMd = async (
	imageUrl: string,
	config: {
		model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4.5-preview'
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

	// console.log(
	// 	`${model}
	// 	---------------------------
	// 	Input: ${promptTokens} tokens - $${input}
	// 	Output: ${completionTokens} tokens - $${output}
	// 	Total: $${input + output} - $MXN ${(input + output) * PESO_MXN * 1.02}
	// 	`
	// )

	return { text, pricing: input + output }
}
