import { tool } from 'ai'
import { z } from 'zod'

function randomInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const getWeather = async ({ city }: { city: string }) => {
	return randomInteger(1, 40)
}

export const getWeatherTool = tool({
	description: 'Función para obtener el clima de una ciudad',
	parameters: z.object({
		city: z.string().describe('El nombre de la ciudad'),
	}),
	execute: getWeather,
	type: 'function',
})
