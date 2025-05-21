import { getAiPlugin } from '@/ai/plugins'
import { generateResponse } from '@/lib/chat'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { openai } from '@ai-sdk/openai'
import { CoreTool, Message, streamText } from 'ai'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ chatId: string }> }
) {
	const { messages }: { messages: Message[] } = await req.json()

	const { chatId } = await params

	const chatObjectId = new ObjectId(chatId)

	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	// TODO: Se puede hacer más eficiente esto:
	const chatResult = await chatCollection.findOne({
		_id: chatObjectId,
	})

	if (chatResult) {
		await chatCollection.updateOne(
			{ _id: chatObjectId },
			{
				$push: {
					messages: messages[messages.length - 1],
				},
			}
		)

		// TODO: Se puede hacer más eficiente esto:
		await chatBotCollection.updateOne(
			{
				_id: chatResult.chatBotId,
			},
			{
				$inc: {
					totalMessages: 1,
				},
			}
		)

		const chatBotResult = await chatBotCollection.findOne({
			_id: chatResult.chatBotId,
		})

		if (chatBotResult) {
			const response = await generateResponse(chatBotResult, messages, chatObjectId, false)

            return NextResponse.json({
                reply: response,
            })
		} else {
			return NextResponse.json(
				{
					message: 'ChatBot not found',
				},
				{
					status: 404,
				}
			)
		}
	} else {
		return NextResponse.json(
			{
				message: 'Chat not found',
			},
			{
				status: 404,
			}
		)
	}
}