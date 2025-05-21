'use client'

import { aiPlugins } from '@/ai/plugins'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ChatBotRecord, ToolSetting } from '@/types/ChatBot'
import { MessageCircle, MoreVertical, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
// import ToolDialog from './ToolDialog'
import { set } from 'zod'
import { useChatBot } from '../../ChatBotContext'
import { IntegrationType } from '@/types/Integration'
import IntegrationsDialog from './_IntegrationsDialog'

export const integrations: {
	[key: string]: {
		name: string
		description: string
		icon: React.ReactNode
	}
} = {
	wa: {
		name: 'WhatsApp',
		description: 'Connect your WhatsApp account to send and receive messages.',
		icon: <MessageCircle />,
	},
}

type IntegrationCardProps = {
	integration: string
	using?: boolean
	handleAddIntegration: (toolId: string) => void
	handleDeleteIntegration: (func: string) => void
	handleEditIntegration: () => void
}

const IntegrationCard = ({
	integration,
	using = false,
	handleAddIntegration,
	handleDeleteIntegration,
	handleEditIntegration,
}: IntegrationCardProps) => {
	return (
		<Card key={integration} className="flex flex-col">
			<CardHeader>
				<div className="flex justify-between items-start">
					<div className="flex items-center space-x-2">
						<CardTitle className="text-xl flex gap-2">
							{integrations[integration].icon}
							{integrations[integration].name}
						</CardTitle>
					</div>
					{using && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{/* <DropdownMenuItem onClick={handleEditIntegration}>Edit</DropdownMenuItem> */}
								<DropdownMenuItem>
									<Link href={`/chatbot/${integration}/analytics`}>View Analytics</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleDeleteIntegration(integration)}
									className="text-red-600 cursor-pointer">
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				<CardDescription className="flex flex-col justify-between">
					<p>{integrations[integration].description}</p>
					{!using && (
						<Button
							onClick={() => handleAddIntegration(integration)}
							className="my-2 w-full"
							variant="outline"
							size="sm">
							Add Integration
						</Button>
					)}
				</CardDescription>
			</CardHeader>
		</Card>
	)
}

export default function IntegrationsPage() {
	const { chatBot, setChatBot } = useChatBot()
	const [activeIntegrations, setActiveIntegrations] = useState(new Set<string>())
	const [currentIntegration, setCurrentIntegration] = useState('')
	const [isUpdating, setIsUpdating] = useState(false)

	useEffect(() => {
		setActiveIntegrations(
			new Set(chatBot.integrations.map((integration) => integration.type))
		)
	}, [chatBot])

	// Uses prev API V1
	const handleDeleteIntegration = async (integration: string) => {
		if (!chatBot) return
		const result = await fetch(`/api/integrations`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				botId: chatBot._id,
				integration,
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				integrations: chatBot.integrations.filter((i) => i.type !== integration),
			}
			setChatBot(newData)
		}
	}

	const handleAddIntegration = async (users: string[]) => {
		const result = await fetch(`/api/integrations`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				botId: chatBot._id,
				type: currentIntegration,
				users,
			}),
		})
		const data = await result.json()
		if (result.ok) {
			const newData = {
				...chatBot,
				integrations: [
					...chatBot.integrations,
					{
						type: currentIntegration as IntegrationType,
						users,
						_id: data.id,
						chatBotId: chatBot._id,
						settings: {}
					},
				],
			}
			setChatBot(newData)
		}
		setCurrentIntegration('')
	}

	const handleEditIntegration = async (users: string[]) => {
		const copyIntegrations = [...chatBot.integrations]
		const integrationIndex = copyIntegrations.findIndex(
			(integration) => integration.type === currentIntegration
		)

		if (integrationIndex !== -1) {
			const prevElement = copyIntegrations[integrationIndex]
			copyIntegrations[integrationIndex] = {
				...prevElement,
				type: currentIntegration as IntegrationType,
				users,
			}
		}

		const result = await fetch(`/api/integrations`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botId: chatBot._id,
				updatedUsers: users,
				integrationId: copyIntegrations[integrationIndex]._id,
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				integrations: copyIntegrations,
			}

			setChatBot(newData)
		}
		setCurrentIntegration('')
	}

	return (
		<div className="max-w-7xl flex flex-col gap-4">
			<section className="flex w-full max-w-2xl items-center space-x-2">
				<div className="w-full relative">
					<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
					<Input type="text" placeholder="Search for Tools" className="pl-8" />
				</div>
			</section>
			<section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<IntegrationsDialog
					setIsUpdating={setIsUpdating}
					saveIntegration={handleAddIntegration}
					setIntegration={setCurrentIntegration}
					integration={currentIntegration}
					isUpdating={isUpdating}
					updateIntegration={handleEditIntegration}
					initialUsers={
						chatBot.integrations.find((int) => int.type === currentIntegration)?.users
					}
				/>
				{[
					...activeIntegrations,
					...Object.keys(integrations).filter(
						(integration) => !activeIntegrations.has(integration)
					),
				].map((integration) => (
					<IntegrationCard
						handleEditIntegration={() => {
							setCurrentIntegration(integration)
							setIsUpdating(true)
						}}
						handleDeleteIntegration={handleDeleteIntegration}
						handleAddIntegration={() => setCurrentIntegration(integration)}
						key={integration}
						integration={integration}
						using={activeIntegrations.has(integration)}
					/>
				))}
			</section>
		</div>
	)
}
