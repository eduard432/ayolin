'use client'

import { ChatBotRecord } from '@/types/ChatBot'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaPencil, FaRegMessage, FaRegTrashCan } from 'react-icons/fa6'

const ChatBots = ({ chatBots: initialChatBots }: { chatBots: ChatBotRecord[] }) => {
	const [chatBots, setChatBots] = useState(initialChatBots)
	const router = useRouter()

	const handleDeleteData = async (id: string) => {
		const response = await fetch(`/api/chatbot/${id}`, {
			method: 'DELETE',
		})
		if (response.ok) {
			setChatBots((data) => {
				const newData = [...data]
				const index = newData.findIndex((chatbot) => chatbot._id == id)
				if (index > -1) {
					newData.splice(index, 1)
				}
				return newData
			})
		}
	}

	return (
		<section className="grid grid-cols-4 gap-4">
			{chatBots.map(({ model, name, _id, defaultChatId }, i) => (
				<div
					key={i}
					className="p-2 px-4 border rounded border-gray-300 min-w-48 group min-h-28">
					<h2 className="text-xl font-semibold">{name}</h2>
					<p>Model: {model}</p>
					<div className="mt-2 hidden space-x-2 group-hover:flex">
						<button
							className="text-sm bg-black text-white rounded p-2"
							onClick={() => router.push(`/dashboard/chatbot/edit/${_id}`)}>
							<FaPencil />
						</button>
						<button
							className="text-sm bg-black text-white rounded p-2"
							onClick={() => handleDeleteData(_id)}>
							<FaRegTrashCan />
						</button>
						<button
							className="text-sm bg-black text-white rounded p-2"
							onClick={() => router.push(`/dashboard/chat/${defaultChatId}`)}>
							<FaRegMessage />
						</button>
					</div>
				</div>
			))}
		</section>
	)
}

export default ChatBots
