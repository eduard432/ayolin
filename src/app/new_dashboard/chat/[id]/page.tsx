'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaPencil, FaTrash } from 'react-icons/fa6'
import { Message } from 'ai'
import ForwardButton from '@/components/client/ForwardButton'
import Chat from '@/components/client/Chat'
import { WithId } from 'mongodb'
import { ChatBot } from '@/types/ChatBot'
import Header from '@/components/Header'

export default function DashBoardChatPage() {
	const [chatInfo, setChatInfo] = useState<{
		chatBot: WithId<ChatBot>
		messages: Message[]
	}>()
	const [clean, setClean] = useState<boolean>(false)
	const { id } = useParams<{ id: string }>()

	const router = useRouter()

	useEffect(() => {
		getChatInfo()
		return setChatInfo(undefined)
	}, [id])

	const getChatInfo = async () => {
		const response = await fetch(`/api/chat/${id}`)
		if (response.ok) {
			const data = await response.json()
			setChatInfo(data)
		} else {
			router.push('/new_dashboard/chatbot')
		}
	}

	const handleDeleteAllMessages = async () => {
		const response = await fetch(`/api/messages/${id}`, {
			method: 'DELETE',
		})
		if (response.ok) {
			setClean(true)
		}
	}

	return (
		<main className="p-4 px-12 h-screen bg-neutral-50 text-neutral-950">
			{chatInfo && (
				<main>
					<Header
						title={{
							content: `Chat Bots`,
							url: `/new_dashboard/chatbot`,
						}}
						subTitle="Admin Chat"
					/>
					<h3 className="text-4xl p-4 font-semibold">Chateando con: {chatInfo.chatBot.name}</h3>
					<p className="text-xl p-4 text-semibold">Usa el model: {chatInfo.chatBot.model}</p>
					<section className="w-full my-4">
						<div className="flex gap-1">
							<button
								onClick={() =>
									router.push(`/dashboard/chatbot/edit/${chatInfo.chatBot._id}`)
								}
								className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
								<FaPencil /> Editar ChatBot
							</button>
							<button
								onClick={() => handleDeleteAllMessages()}
								className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
								<FaTrash /> Eliminar Mensajes
							</button>
						</div>
					</section>
					<Chat id={id} messages={chatInfo.messages} clean={clean} setClean={setClean} />
				</main>
			)}
		</main>
	)
}
