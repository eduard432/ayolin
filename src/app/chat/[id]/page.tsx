import { getChatInfo } from '@/app/services/server/chatService'
import Chat from '@/components/client/Chat'
import { notFound } from 'next/navigation'
import React from 'react'

interface ChatPageProps {
	params: {
		id: string
	}
}

export default async function ChatPage({ params }: ChatPageProps) {
	const { id } = await params

	const chat = await getChatInfo(id)

	if (!chat) return notFound()

	return (
		<main className="p-4 px-12 h-screen bg-neutral-50 text-neutral-950">
			<>
				<h2 className="text-2xl font-semibold">Chateando con: {chat.chatBot.name}</h2>
				<Chat messages={chat.messages} id={id} />
			</>
		</main>
	)
}
