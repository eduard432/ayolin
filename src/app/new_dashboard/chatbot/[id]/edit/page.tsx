import { getChatBot } from '@/app/services/server/chatbotService'
import Header from '@/components/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { notFound } from 'next/navigation'
import React from 'react'
import { Activity } from './Activity'
import { Settings } from './Settings'
import { Tools } from './Tools'

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
				<Tabs defaultValue="activity" className="mt-4">
					<TabsList>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
						<TabsTrigger value="tools">Tools</TabsTrigger>
						<TabsTrigger value="chats">Chats</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
					</TabsList>
					<TabsContent value="activity"><Activity /></TabsContent>
					<TabsContent value="settings"><Settings /></TabsContent>
					<TabsContent value="tools"><Tools /></TabsContent>
				</Tabs>
			</section>
		</main>
	)
}
