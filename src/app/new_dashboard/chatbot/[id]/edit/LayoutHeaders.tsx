"use client"

import Header from '@/components/Header'
import React from 'react'
import { useChatBot } from './ChatBotContext'

export const LayoutHeader = () => {
    const { chatBot } = useChatBot()
	return (
		<Header
			title={{
				content: 'Chat Bot',
				url: '/new_dashboard/chatbot',
			}}
			subTitle={chatBot.name}
		/>
	)
}

export const LayoutTitle = () => {
	const { chatBot } = useChatBot()
	return (
		<h3 className="text-4xl font-semibold">{chatBot.name}</h3>
	)
}
