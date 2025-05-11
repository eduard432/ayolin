import { getDatabase } from '@/lib/db'
import { ChatDb } from '@/types/Chat'
import { ChatBotDb } from '@/types/ChatBot'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateWithSource } from '@/lib/api/validate'

// PUT: Update a chatbot:
// /api/chatbots/:chatbotId
const paramsSchema = z.object({
    chatBotId: z.string(),
})

const updateBodySchema = z.object({
    name: z.string(),
    model: z.string(),
    initialPrompt: z.string(),
}).strict()

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{chatBotId: string}> }
) {
    const { chatBotId } = validateWithSource(paramsSchema, params, "params")
    const objectId = new ObjectId(chatBotId)

    const db = await getDatabase()
    const chatBotCollection = db.collection<ChatBotDb>('chatbot')

    const body = await request.json()
    const data = validateWithSource(updateBodySchema, body, "body")

    const result = await chatBotCollection.updateOne(
        { _id: objectId },
        { $set: data }
    )

    const res = NextResponse

    if (result.modifiedCount > 0) {
        return res.json({
            msg: 'Chatbot updated!!!',
        })
    } else {
        return res.json(
            {
                msg: 'Error trying to update chatbot!!',
            },
            {
                status: 500,
            }
        )
    }
}

// DELETE: Delete a chatbot:
// /api/chatbots/:chatbotId
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{chatBotId: string}> }
) {
    const { chatBotId } = validateWithSource(paramsSchema, params, "params")
    const objectId = new ObjectId(chatBotId)

    const db = await getDatabase()
    const chatBotCollection = db.collection<ChatBotDb>('chatbot')
    const chatCollection = db.collection<ChatDb>('chat')

    const chatBotResult = await chatBotCollection.deleteOne({ _id: objectId })
    await chatCollection.deleteMany({ chatBotId: objectId })

    const res = NextResponse

    if (chatBotResult.deletedCount > 0) {
        return res.json({
            msg: 'Chatbot removed!!!',
        })
    } else {
        return res.json(
            {
                msg: 'Error trying to remove chatbot!!',
            },
            {
                status: 500,
            }
        )
    }
}