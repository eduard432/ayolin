import { handleApiError } from '@/lib/api/handleError'
import { validateWithSource } from '@/lib/api/validate'
import { integrations } from '@/lib/integrations'
import { addIntegration, deleteIntegration } from '@/services/integration.service'
import { addPlugin, deletePlugin, updatePlugin } from '@/services/plugin.service'
import { IntegrationType } from '@/types/Integration'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const TypesSchema = z.enum(["wa", "tg"])

// GET: Get all available integrations:
// /api/v2/chatbots/:chatbotId/integrations
export async function GET() {
    return NextResponse.json({
        integrations,
    })
}

// POST: Add a integration to a chatbot:
// /api/v2/chatbots/:chatbotId/integrations
const paramsSchema = z.object({
    chatBotId: z.string(),
})

const bodySchema = z.object({
    type: TypesSchema,
    settings: z.record(z.string()),
})

export async function POST(
    request: NextRequest,
    { params: promiseParams }: { params: Promise<{ chatBotId: string }> }
) {
    try {
        const params = await promiseParams
        const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
        const body = await request.json()
        const { type, settings } = validateWithSource(bodySchema, body, 'body')

        const result = await addIntegration(chatBotId, type, settings)

        const res = NextResponse
        if (result) {
            return res.json({
                msg: 'Integration Added',
                integrationId: result.toString()
            })
        } else {
            return res.json(
                {
                    msg: 'Chat bot not found or integration already exists',
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

// DELETE: Delete a integration from a chatbot:
// /api/v2/chatbots/:chatbotId/integrations

const deleteBodySchema = z.object({
    type: TypesSchema
})

export async function DELETE(
    request: NextRequest,
    { params: promiseParams }: { params: Promise<{ pluginId: string }> }
) {
    try {
        const params = await promiseParams
        const { chatBotId } = validateWithSource(paramsSchema, params, 'params')
        const body = await request.json()
        const { type } = validateWithSource(deleteBodySchema, body, 'body')
        const result = await deleteIntegration(chatBotId, type as IntegrationType)
        const res = NextResponse

        if (result) {
            return res.json({
                msg: 'Integration Deleted',
            })
        } else {
            return res.json(
                {
                    msg: 'Chatbot or integration not found',
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
