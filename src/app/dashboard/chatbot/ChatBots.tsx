"use client"

import { ChatBotRecord } from '@/types/ChatBot'
import {useState} from 'react'
import { ChatBotCard } from './ChatBotCard'

const ChatBots = ({chatBots: defaultChatBots}: {chatBots: ChatBotRecord[]}) => {

    const [chatBots, setChatBots] = useState<ChatBotRecord[]>(defaultChatBots)

	return (
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
			{chatBots.map((chatbot) => (
				<ChatBotCard setChatBots={setChatBots} key={chatbot._id} chatBot={chatbot} />
			))}

			<div className="rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
			<div className="rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
			<div className="rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
		</div>
	)
}

export default ChatBots
