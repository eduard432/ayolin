import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateWithSource } from '@/lib/api/validate'
import { handleApiError } from '@/lib/api/handleError'
import { deleteChatBot, updateChatBot } from '@/services/chatbot.service'

// PUT: Update a chatbot:
// /api/chatbots/:chatbotId
const paramsSchema = z.object({
	chatBotId: z.string(),
})

const updateBodySchema = z
	.object({
		name: z.string(),
		model: z.string(),
		initialPrompt: z.string(),
	})
	.strict()

export async function PUT(
	request: NextRequest,
	{ params: paramsPromise }: { params: Promise<{ chatBotId: string }> }
) {
	try {
		const params = await paramsPromise
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const body = await request.json()
		const data = validateWithSource(updateBodySchema, body, 'body')

		const result = await updateChatBot(chatBotId, data)

		const res = NextResponse

		if (result) {
			return res.json({
				msg: 'Chatbot updated.',
			})
		} else {
			return res.json(
				{
					msg: 'Chat bot not found.',
				},
				{
					status: 404,
				}
			)
		}
	} catch (error) {
		return handleApiError(error)
	}
}

// DELETE: Delete a chatbot:
// /api/chatbots/:chatbotId
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ chatBotId: string }> }
) {
	try {
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const result = await deleteChatBot(chatBotId)

		const res = NextResponse

		if (result) {
			return res.json({
				msg: 'Chatbot removed.',
			})
		} else {
			return res.json(
				{
					msg: 'Chat bot not found.',
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
