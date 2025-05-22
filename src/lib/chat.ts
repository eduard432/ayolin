import { getAiPlugin } from '@/ai/plugins'
import { ChatBot, ChatBotDb } from '@/types/ChatBot'
import { openai } from '@ai-sdk/openai'
import {
	CoreTool,
	Message,
	streamText,
	generateText,
	LanguageModelResponseMetadata,
	CoreAssistantMessage,
	CoreToolMessage,
	LanguageModelUsage,
} from 'ai'
import { ObjectId, WithId } from 'mongodb'
import { getDatabase } from './db'
import { ChatDb } from '@/types/Chat'

type ChatResponse = LanguageModelResponseMetadata & {
	readonly messages: Array<CoreAssistantMessage | CoreToolMessage>
}

const processFinish = async (
	chatBot: WithId<ChatBot>,
	chatId: ObjectId,
	{
		text,
		response,
		usage,
	}: { text: string; response: ChatResponse; usage: LanguageModelUsage }
) => {
	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	console.log({ text })
	await chatCollection.updateOne(
		{ _id: chatId },
		{
			$push: {
				messages: {
					role: 'assistant',
					content: text,
					// @ts-ignore
					id: response.messages[response.messages.length - 1].id,
				},
			},
		}
	)
	await chatBotCollection.updateOne(
		{
			_id: chatBot._id,
		},
		{
			$inc: {
				totalMessages: 1,
				'usedTokens.input': usage.promptTokens,
				'usedTokens.output': usage.completionTokens,
			},
		}
	)
}

export const generateResponse = async (
	chatBot: WithId<ChatBot>,
	messages: Message[],
	chatId: ObjectId,
	stream = true
) => {
	const db = await getDatabase()

	const { model, initialPrompt, name, tools: toolObjects } = chatBot

	const tools: { [key: string]: CoreTool } = {}

	for (let i = 0; i < toolObjects.length; i++) {
		const toolObject = toolObjects[i]
		const tool = getAiPlugin(toolObject.id, toolObject.settings)
		tools[toolObject.id] = tool
	}

	if (stream) {
		const result = streamText({
			model: openai(model),
			system: `${name} - ${initialPrompt}`,
			// Only use last 8 messages:
			messages: messages.slice(-8),
			onFinish: (data) => processFinish(chatBot, chatId, data),
			tools,
			maxSteps: 3,
		})
		return result.toDataStreamResponse()
	} else {
		const { text, usage, response } = await generateText({
			model: openai(model),
			system: `${name} - ${initialPrompt}`,
			// Only use last 8 messages:
			messages: messages.slice(-8),
			tools,
			maxSteps: 3,
		})
		await processFinish(chatBot, chatId, { text, usage, response })

		return  text
	}
}