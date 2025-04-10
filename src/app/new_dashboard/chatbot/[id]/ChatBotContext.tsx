'use client'
import { ChatBotRecord } from '@/types/ChatBot'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

type ChatBotContextType = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord>>
}

const ChatBotContext = createContext<ChatBotContextType>({} as ChatBotContextType)

export const ChatBotContextProvider = ({
	value,
	children,
}: {
	value: ChatBotRecord
	children: React.ReactNode
}) => {
	const [chatBot, setChatBot] = useState(value)
	return (
		<ChatBotContext.Provider value={{ chatBot, setChatBot }}>
			{children}
		</ChatBotContext.Provider>
	)
}

export const useChatBot = () => {
	const context = useContext(ChatBotContext)
	if (context === undefined) {
		throw new Error('useMyContext debe usarse dentro de ChatBotContextProvider')
	}
	return context
}
