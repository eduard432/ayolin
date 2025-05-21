import { getAiPlugin } from '@/ai/plugins'
import { ChatBot, ChatBotDb } from '@/types/ChatBot'
import { openai } from '@ai-sdk/openai'
import { CoreTool, Message, streamText } from 'ai'
import { ObjectId, WithId } from 'mongodb'
import { getDatabase } from './db'
import { ChatDb } from '@/types/Chat'

export const generateResponse = async (
	chatBot: WithId<ChatBot>,
	messages: Message[],
	chatId: ObjectId,
    stream = true
) => {
	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const { model, initialPrompt, name, tools: toolObjects } = chatBot

	const tools: { [key: string]: CoreTool } = {}

	for (let i = 0; i < toolObjects.length; i++) {
		const toolObject = toolObjects[i]
		const tool = getAiPlugin(toolObject.id, toolObject.settings)
		tools[toolObject.id] = tool
	}
	const result = streamText({
		model: openai(model),
		system: `${name} - ${initialPrompt}`,
		// Only use last 8 messages:
		messages: messages.slice(-8),
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
		},
		tools,
		maxSteps: 3,
	})

    return stream ? result.toDataStreamResponse() : result.text
}
