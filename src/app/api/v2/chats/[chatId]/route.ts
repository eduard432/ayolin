import { getAiPlugin } from '@/ai/plugins'
import { getChatInfo } from '@/services/chat.service'
import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { openai } from '@ai-sdk/openai'
import { CoreTool, Message, streamText } from 'ai'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
	chatId: z.string(),
})

export async function GET(
	request: NextRequest,
	{ params: paramsPromise }: { params: Promise<{ chatId: string }> }
) {
	try {
		const params = await paramsPromise
		const { chatId } = validateWithSource(paramsSchema, params, 'params')
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
	} catch (error) {
		return handleApiError(error)
	}
}

const bodySchema = z.object({
	messages: z.array(z.any()),
})

export async function POST(
	req: Request,
	{ params: paramsPromise }: { params: Promise<{ chatId: string }> }
) {
	try {
		const body = await req.json()
		const { messages }: { messages: Message[] } = validateWithSource(
			bodySchema,
			body,
			'body'
		)

		const params = await paramsPromise
		const { chatId } = validateWithSource(paramsSchema, params, 'params')

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
				const { model, initialPrompt, name, tools: toolObjects } = chatBotResult

				const tools: { [key: string]: CoreTool } = {}

				for (let i = 0; i < toolObjects.length; i++) {
					const toolObject = toolObjects[i]
					const tool = getAiPlugin(toolObject.id, toolObject.settings)
					tools[toolObject.id] = tool
				}

				const result = streamText({
					model: openai.chat(model),
					system: `${name} - ${initialPrompt}`,
					// Only use last 8 messages:
					messages: messages.slice(-8),
					onFinish: async ({ text, response, usage }) => {
						console.log({ text })
						await chatCollection.updateOne(
							{ _id: chatObjectId },
							{
								$push: {
									messages: {
										role: 'assistant',
										content: text,
										id: response.messages[response.messages.length - 1].id,
									},
								},
							}
						)
						await chatBotCollection.updateOne(
							{
								_id: chatResult.chatBotId,
							},
							{
								$inc: {
									totalMessages: 1,
									'usedTokens.input': usage.promptTokens,
									'usedTokens.output': usage.completionTokens,
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
	} catch (error) {
		return handleApiError(error)
	}
}
