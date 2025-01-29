import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { Message } from 'ai'
import { ObjectId, WithId } from 'mongodb'

export async function getChatInfo(id: string) {
	const db = await getDatabase()
	const chatCollection = db.collection<ChatDb>('chat')
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const chatId = new ObjectId(id)
	const chatResult = await chatCollection.findOne({ _id: chatId })

	if (chatResult) {
		const chatBotResult = await chatBotCollection.findOne({ _id: chatResult.chatBotId })
		if (chatBotResult) {
			const messages: Message[] = []

			chatResult.messages.forEach(({ role, content }) => {
				if (role !== 'tool') {
					const id = new ObjectId().toString()
					if (typeof content === 'string') {
						messages.push({
							role,
							content,
							id,
						})
					} else {
						content.forEach((subContent) => {
							if (subContent.type === 'text' && subContent.text !== '') {
								messages.push({
									role,
									content: subContent.text,
									id,
								})
							}
						})
					}
				}
			})

			const result: {
				chatBot: WithId<ChatBotDb>
				messages: Message[]
			} = {
				chatBot: chatBotResult,
				messages,
			}
			return result
		}
	} else {
		return undefined
	}
}
