import { getChatBot } from '@/app/services/server/chatbotService'
import Header from '@/components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { notFound } from 'next/navigation'
import React from 'react'
import TabsClient from './TabsClient'


export default async function page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const chatBot = await getChatBot(id)
	if (!chatBot) return notFound()

	return (
		<main>
			<Header title={{
				content: 'Chat Bot',
				url: '/new_dashboard/chatbot'
			}} subTitle={chatBot.name} />
			<section className="p-4">
				<h3 className="text-4xl font-semibold">{chatBot.name}</h3>
				<TabsClient chatBot={chatBot} />
			</section>
		</main>
	)
}
