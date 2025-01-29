'use client'

import React, { useState } from 'react'
import Settings from './Settings'
import ActionMenu from './ActionMenu'
import Plugins from './Plugins'
import Stats from './Stats'
import { ChatBotRecord } from '@/types/ChatBot'

const Form = ({ chatBot: initialChatBot }: { chatBot: ChatBotRecord }) => {
	const [chatBot, setChatBot] = useState<ChatBotRecord>(initialChatBot)

	return (
		<div className="w-1/2 mx-auto">
			<ActionMenu chatBot={chatBot} />
			<Settings chatBot={chatBot} setChatBot={setChatBot} />
			<hr className="my-4" />
			<Plugins chatBot={chatBot} setChatBot={setChatBot} />
			<hr className="my-4" />
			<Stats chatBot={chatBot} />
		</div>
	)
}

export default Form
