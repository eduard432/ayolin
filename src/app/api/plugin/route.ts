import { aiPlugins } from "@/app/ai/plugins";
import { getDatabase } from "@/lib/db";
import { ChatBotDb } from "@/types/ChatBot";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET () {
    const plugins = Object.keys(aiPlugins)
    return NextResponse.json({
        plugins
    })
}

export async function POST (request: NextRequest) {
    const { botId, plugin }: {botId: string, plugin: string} = await request.json()

    const db = await getDatabase()
    const chatBotCollection = db.collection<ChatBotDb>('chatbot')
    const chatBotId = new ObjectId(botId)

    const query = {
        _id: chatBotId,
        tools: { $nin: [plugin] }
    }

    const update = {
        $push: {
            tools: plugin
        }
    }

    const result = await chatBotCollection.updateOne(query, update)

    const res = NextResponse
    if (result.modifiedCount > 0) {
        return res.json({
            msg: 'Plugin Added'
        })
    } else {
        return res.json({
            msg: 'Error Adding Plugin'
        }, {
            status: 500
        })
    }

}

export async function DELETE (request: NextRequest, {params}: {params: Promise<{botId: string, plugin: string}>}) {
    const { botId, plugin }: {botId: string, plugin: string} = await request.json()

    const db = await getDatabase()
    const chatBotCollection = db.collection<ChatBotDb>('chatbot')
    const chatBotId = new ObjectId(botId)

    const query = {
        _id: chatBotId,
        tools: { $in: [plugin] }
    }

    const update = {
        $pull: {
            tools: plugin
        }
    }

    const result = await chatBotCollection.updateOne(query, update)

    const res = NextResponse
    if (result.modifiedCount > 0) {
        return res.json({
            msg: 'Plugin Removed'
        })
    } else {
        return res.json({
            msg: 'Error removing plugin'
        }, {
            status: 500
        })
    }

}