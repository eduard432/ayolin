import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { addChat } from '@/services/chat.service'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// GET: Generate a new chat link:
// /api/chatbots/:chatbotId/link
const paramsSchema = z.object({
	chatBotId: z.string(),
})

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ chatBotId: string }> }
) {
	try {
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const result = await addChat(chatBotId)

		const response = NextResponse

		if (result) {
			const url = request.nextUrl.clone()
			url.pathname = `/chat/${result}`
			return response.redirect(url)
		} else {
			return response.json(
				{
					message: 'Chatbot not found.',
				},
				{
					status: 500,
				}
			)
		}
	} catch (error) {
		return handleApiError(error)
	}
}
