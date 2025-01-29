import { aiPlugins } from '@/ai/plugins'
import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { openai } from '@ai-sdk/openai'
import {
	CoreAssistantMessage,
	CoreMessage,
	CoreTool,
	CoreToolMessage,
	CoreUserMessage,
	generateText,
	LanguageModelResponseMetadata,
	LanguageModelUsage,
	streamText,
} from 'ai'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id: chatId } = await params

	const db = await getDatabase()
	const {
		messages,
		contactName,
		stream,
		allMessages,
	}: {
		messages: CoreUserMessage[]
		contactName?: string
		stream: boolean
		allMessages: boolean
	} = await request.json()

	const chatObjectId = new ObjectId(chatId)

	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const chatResult = await chatCollection.findOne({
		_id: chatObjectId,
	})

	if (chatResult) {
		const chatBotResult = await chatBotCollection.findOne({
			_id: chatResult.chatBotId,
		})

		if (chatBotResult) {
			const { model, initialPrompt, name, tools: toolsId } = chatBotResult

			const conversation: CoreMessage[] = !allMessages
				? [...chatResult.messages, ...messages]
				: messages

			const tools: { [key: string]: CoreTool } = {}

			for (let i = 0; i < toolsId.length; i++) {
				const toolId = toolsId[i]
				const tool = aiPlugins[toolId]
				tools[toolId] = tool
			}

			console.log({ conversation })

			// const aiConfig =

			if (stream) {
				const result = streamText({
					model: openai(model),
					messages: conversation,
					system: `${name} - ${initialPrompt},
						${contactName && 'Acualmente estás ayudando a: ' + contactName}`,
					onFinish: async ({
						usage,
						response,
					}: {
						usage: LanguageModelUsage
						response: LanguageModelResponseMetadata & {
							messages: Array<CoreAssistantMessage | CoreToolMessage>
						}
					}) => {
						const { messages: aiMessages } = response
						console.log({ aiMessages })

						await chatCollection.updateOne(
							{ _id: chatObjectId },
							{
								$push: {
									messages: {
										$each: [messages[0], ...aiMessages],
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
				const { text } = await generateText({
					model: openai(model),
					messages: conversation,
					system: `${name} - ${initialPrompt},
						${contactName && 'Acualmente estás ayudando a: ' + contactName}`,
					onStepFinish: async ({
						usage,
						response,
					}: {
						usage: LanguageModelUsage
						response: LanguageModelResponseMetadata & {
							messages: Array<CoreAssistantMessage | CoreToolMessage>
						}
					}) => {
						const { messages: aiMessages } = response
						console.log({ aiMessages })

						await chatCollection.updateOne(
							{ _id: chatObjectId },
							{
								$push: {
									messages: {
										$each: [messages[0], ...aiMessages],
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

				return NextResponse.json({
					response: text,
				})
			}
		}
	} else {
		return NextResponse.json(
			{
				msg: 'Chat not founded',
			},
			{
				status: 404,
			}
		)
	}
}
