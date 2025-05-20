import { getChatBot } from '@/services/chatbot.service'
import Header from '@/components/Header'
import { NavTabContent, NavTabs, NavTabTrigger } from '@/components/nav-tool'
import { notFound } from 'next/navigation'
import { ChatBotContextProvider } from './ChatBotContext'
import {LayoutHeader, LayoutTitle} from './LayoutHeaders'

export default async function EditChatBotLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const chatBot = await getChatBot(id)
	if (!chatBot) return notFound()

	return (
		<ChatBotContextProvider value={chatBot}>
				<LayoutHeader />
				<section className="p-4">
					<LayoutTitle />
					<NavTabs className="mt-4">
						<NavTabTrigger href={`/dashboard/chatbot/${id}/activity`}>
							Activity
						</NavTabTrigger>
						<NavTabTrigger href={`/dashboard/chatbot/${id}/edit/settings`}>
							Settings
						</NavTabTrigger>
						<NavTabTrigger href={`/dashboard/chatbot/${id}/edit/tools`}>
							Tools
						</NavTabTrigger>
						<NavTabTrigger href={`/dashboard/chatbot/${id}/edit/chats`}>
							Chats
						</NavTabTrigger>
						<NavTabTrigger href={`/dashboard/chatbot/${id}/edit/integrations`}>
							Integrations
						</NavTabTrigger>
						<NavTabTrigger href={`/dashboard/chatbot/${id}/edit/content`}>
							Content
						</NavTabTrigger>
					</NavTabs>
					<NavTabContent>{children}</NavTabContent>
				</section>
		</ChatBotContextProvider>
	)
}
