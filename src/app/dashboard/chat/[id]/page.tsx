'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaPencil, FaTrash } from 'react-icons/fa6'
import { Message } from 'ai'
import ForwardButton from '@/components/client/ForwardButton'
import Chat from '@/components/client/Chat'
import { WithId } from 'mongodb'
import { ChatBot } from '@/types/ChatBot'

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
			router.push('/dashboard')
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
		<main className="p-4 px-12 h-screen">
			<ForwardButton />
			{chatInfo && (
				<>
					<h2 className="text-2xl font-semibold">
						Chateando con: {chatInfo.chatBot.name}
					</h2>
					<p className="text-xl text-semibold">Usa el model: {chatInfo.chatBot.model}</p>
					<section className="w-2/3 mx-auto my-4 flex justify-end">
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
				</>
			)}
		</main>
	)
}
