'use client'

import { ChatBotRecord } from '@/types/ChatBot';
import React, { useEffect, useState } from 'react'

const Stat = ({ value, name }: { value: number; name: string }) => {
	return (
		<div className="w-1/3 border border-gray-300 rounded p-4">
			<p className="text-gray-500">{name}:</p>
			<h5 className="text-5xl font-mono flex items-start">
				{value
					.toLocaleString('es-MX', {
						notation: 'compact',
						maximumFractionDigits: 2,
					})
					.replaceAll(/\s/g, '')}
			</h5>
		</div>
	)
}

const Stats = ({ chatBot }: { chatBot: ChatBotRecord }) => {
	const [stats, setStats] = useState<[number, number]>([0, 0])

	const handleGetStats = async () => {
		const response = await fetch(
			`/api/stats/${chatBot._id}`
		)
		if (response.ok) {
			const data: {
				chatCount: number
				messageCount: number
			} = await response.json()
			setStats([data.chatCount, data.messageCount])
		}
	}

	useEffect(() => {
		handleGetStats()
	}, [])

	return (
			<section className="my-4 flex gap-4">
				<Stat value={stats[0]} name="Chats" />
				<Stat value={stats[1]} name="Mensajes" />
				<Stat value={chatBot.usedTokens} name="Tokens" />
			</section>
	)
}

export default Stats
