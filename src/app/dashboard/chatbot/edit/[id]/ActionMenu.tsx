'use client'

import { ChatBotRecord } from '@/types/ChatBot'
import { useRouter, usePathname  } from 'next/navigation'
import React from 'react'
import { FaCopy, FaLink, FaRegMessage, FaTrash } from 'react-icons/fa6'

const ActionMenu = ({ chatBot }: { chatBot: ChatBotRecord }) => {
	const router = useRouter()
	const pathName= usePathname()

	const handleDeleteData = async () => {
		const response = await fetch(`/api/chatbot/${chatBot._id}`, {
			method: 'DELETE',
		})
		if (response.ok) {
			router.push('/app')
		}
	}

	return (
		<section>
			<div className="flex gap-1">
				<button
					onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/link/${chatBot._id}`)}
					className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
					<FaLink /> Chat Link
				</button>
				<button
					onClick={() => navigator.clipboard.writeText(chatBot._id)}
					className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
					<FaCopy /> Copiar Id
				</button>
				<button
					onClick={() => router.push(`/dashboard/chat/${chatBot.defaultChatId}`)}
					className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
					<FaRegMessage />
					Admin Chat
				</button>
				<button
					onClick={() => handleDeleteData()}
					className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
					<FaTrash /> Eliminar
				</button>
			</div>
		</section>
	)
}

export default ActionMenu
