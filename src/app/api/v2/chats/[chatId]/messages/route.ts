import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { deleteAllMessages } from '@/services/chat.service'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
	chatId: z.string(),
})

// DELETE: Delete all messages from a chat
// /api/chats/:chatId/messages
export async function DELETE(
	request: NextRequest,
	{ params: paramsPromise }: { params: Promise<{ id: string }> }
) {
	try {
		const params = await paramsPromise
		const { chatId } = validateWithSource(paramsSchema, params, 'params')
	
		const result = await deleteAllMessages(chatId)

		const response = NextResponse
		if (result) {
			return response.json({
				message: 'Messages deleted',
			})
		} else {
			return response.json(
				{
					message: 'Chat not found',
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
