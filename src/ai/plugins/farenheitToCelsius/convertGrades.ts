import { tool } from 'ai'
import { z } from 'zod'

const convertUnits = async ({ temperature }: { temperature: number }) => {
	const celsius = Math.round((temperature - 32) * (5 / 9))
	return {
		celsius,
	}
}

export const farenhetToCelsius = tool({
	description: 'Convertir una temperatura en grados Fahrenheit a Celsius',
	parameters: z.object({
		temperature: z.number().describe('La temperatura en fahrenheit para convertir'),
	}),
	execute: convertUnits,
	type: 'function',
})