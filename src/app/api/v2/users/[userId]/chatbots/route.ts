import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getChatbots } from '@/services/chatbot.service'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Cambiar esta ruta a: /api/chatbots
// para que sea consistente con el resto de la API

// GET: Get all chatbots from user:
// /api/v2/users/:userId/chatbots
const paramsSchema = z.object({
	userId: z.string(),
})

export async function GET(
	request: NextRequest,
	{ params: paramsPromise }: { params: Promise<z.infer<typeof paramsSchema>> }
) {
	try {
		const params = await paramsPromise
		const { userId } = validateWithSource(paramsSchema, params, 'params')
		const result = await getChatbots(userId)

		return NextResponse.json({
			chatbots: result,
		})
	} catch (error) {
		return handleApiError(error)
	}
}
