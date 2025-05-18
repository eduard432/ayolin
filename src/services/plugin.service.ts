import { getDatabase } from '@/lib/db'
import { ChatBotDb, ToolSetting } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'

export const addPlugin = async (
	chatBotId: string,
	plugin: string,
	settings: Record<string, string>
) => {
	const chatBotObjectId = new ObjectId(chatBotId)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')

	const query = {
		_id: chatBotObjectId,
		tools: {
			$not: {
				$elemMatch: { id: plugin },
			},
		},
	}

	const update = {
		$push: {
			tools: {
				id: plugin,
				settings,
			},
		},
	}

	const result = await chatBotCollection.updateOne(query, update)

	return result.acknowledged
}

export const updatePlugin = async (chatBotId: string, plugin: ToolSetting) => {
	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatBotObjectId = new ObjectId(chatBotId)

	const query = {
		_id: chatBotObjectId,
		tools: {
			$elemMatch: { id: plugin.id },
		},
	}

	const update = {
		$set: {
			'tools.$': plugin,
		},
	}

	const result = await chatBotCollection.updateOne(query, update)

	return result.acknowledged
}

export const deletePlugin = async (chatBotId: string, pluginId: string) => {
    const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatBotObjectId = new ObjectId(chatBotId)

    const query = {
		_id: chatBotObjectId,
		tools: {
			$elemMatch: { id: pluginId },
		},
	}

	const update = {
		$pull: {
			tools: {
				id: pluginId,
			},
		},
	}

    const result = await chatBotCollection.updateOne(query, update)

    return result.acknowledged
}