import { aiPlugins } from '@/ai/plugins'
import { getChatInfo } from '@/app/services/server/chatService'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { openai } from '@ai-sdk/openai'
import { CoreTool, Message, streamText } from 'ai'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id: chatId } = await params
	const result = await getChatInfo(chatId)

	const response = NextResponse
	if (result) {
		return response.json({
			...result,
		})
	} else {
		return response.json(
			{
				message: 'Chat Not found',
			},
			{
				status: 404,
			}
		)
	}
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { messages }: { messages: Message[] } = await req.json()

	const { id } = await params

	const chatId = new ObjectId(id)

	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const chatResult = await chatCollection.findOne({
		_id: chatId,
	})

	if (chatResult) {
		await chatCollection.updateOne(
			{ _id: chatId },
			{
				$push: {
					messages: messages[messages.length - 1],
				},
			}
		)

		const chatBotResult = await chatBotCollection.findOne({
			_id: chatResult.chatBotId,
		})

		if (chatBotResult) {
			const { model, initialPrompt, name, tools: toolsId } = chatBotResult

			const tools: { [key: string]: CoreTool } = {}

			for (let i = 0; i < toolsId.length; i++) {
				const toolId = toolsId[i]
				const tool = aiPlugins[toolId]
				tools[toolId] = tool
			}

			const result = streamText({
				model: openai(model),
				system: `${name} - ${initialPrompt}`,
				messages: messages,
				onFinish: async ({ text, response, usage }) => {
					console.log({ text })
					await chatCollection.updateOne(
						{ _id: chatId },
						{
							$push: {
								messages: {
									role: 'assistant',
									content: text,
									id: response.messages[response.messages.length - 1].id,
								},
							},
							$inc: {
								usedTokens: usage.totalTokens,
							},
						}
					)
				},
				tools,
				maxSteps: 3,
			})

			return result.toDataStreamResponse()
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
