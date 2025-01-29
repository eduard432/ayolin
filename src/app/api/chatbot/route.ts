import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBot, ChatBotDb } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

type BodyData = { model: string; name: string; initialPrompt: string; userId: string }

export async function POST(request: NextRequest) {
	const { model, name, initialPrompt, userId }: BodyData = await request.json()

	const chatId = new ObjectId()
	const userObjectId = new ObjectId(userId)

	const db = await getDatabase()
	const chatBotCollection = db.collection<ChatBotDb>('chatbot')
	const chatCollection = db.collection<ChatDb>('chat')

	const chatBot: ChatBotDb = {
		model,
		name,
		initialPrompt,
		defaultChatId: chatId,
		chats: [],
		tools: [],
		usedTokens: 0,
		userId: userObjectId,
	}
	const chatBotResult = await chatBotCollection.insertOne(chatBot)
	await chatCollection.insertOne({ _id: chatId, chatBotId: chatBotResult.insertedId, messages: [] })


    const response = NextResponse

    if(chatBotResult) {
        return response.json({
            msg: 'ChatBot created'
        }, {
            status: 201
        })
    } else {
        return response.json({
            msg: 'Error creating chatbot'
        }, {
            status: 500
        })
    }
}

