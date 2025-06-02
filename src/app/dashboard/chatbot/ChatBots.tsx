'use client'

import { ChatBotRecord } from '@/types/ChatBot'
import { useEffect, useState } from 'react'
import { ChatBotCard } from './ChatBotCard'

const ChatBots = ({
	chatBots: defaultChatBots,
	isLoading
}: {
	chatBots: ChatBotRecord[] | undefined
	isLoading?: boolean
}) => {
	const [chatBots, setChatBots] = useState<ChatBotRecord[]>([])

	useEffect(() => {
		if (defaultChatBots) {
			setChatBots(defaultChatBots)
		}
	}, [defaultChatBots])

	return (
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
			{chatBots &&
				chatBots.map((chatbot) => (
					<ChatBotCard setChatBots={setChatBots} key={chatbot._id} chatBot={chatbot} />
				))}
				{
					isLoading && [...new Array(9)].map((_, i) => (
						<div key={i} className="rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 min-h-40" />
				  ))
				}
		</div>
	)
}

export default ChatBots
