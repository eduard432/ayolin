import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { createChatBot, createChatbotBodySchema } from '@/services/chatbot.service'
import { NextRequest, NextResponse } from 'next/server'

// POST: Create a new chatbot:
// /api/chatbots

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const data = validateWithSource(createChatbotBodySchema, body, 'body')

		const result = await createChatBot(data)

		const response = NextResponse

		if (result) {
			return response.json(
				{
					msg: 'ChatBot created',
					chatbot: result,
				},
				{
					status: 201,
				}
			)
		} else {
			return response.json(
				{
					msg: 'Error creating chatbot',
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
