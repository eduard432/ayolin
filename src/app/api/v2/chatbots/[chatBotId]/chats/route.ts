import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getChats } from '@/services/chat.service'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
	chatBotId: z.string(),
})

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ chatBotId: string }> }
) {
	try {
		const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
		const chats = await getChats(chatBotId)
		return NextResponse.json({
			chats,
		})
	} catch (error) {
		return handleApiError(error)
	}
}