'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useState } from 'react'
import { Activity } from './Activity'
import { Settings } from './Settings'
import { Tools } from './_Tools/Tools'
import { Chats } from './Chats'
import { ChatBotRecord } from '@/types/ChatBot'

const TabsClient = ({chatBot: defaultChatBot}: {chatBot: ChatBotRecord}) => {


    const [chatBot, setChatBot] = useState(defaultChatBot)

	return (
		<Tabs defaultValue="activity" className="mt-4">
			<TabsList>
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
				<TabsTrigger value="tools">Tools</TabsTrigger>
				<TabsTrigger value="chats">Chats</TabsTrigger>
				<TabsTrigger value="content">Content</TabsTrigger>
			</TabsList>
			<TabsContent value="activity">
				<Activity />
			</TabsContent>
			<TabsContent value="settings">
				<Settings chatBot={chatBot} setChatBot={setChatBot} />
			</TabsContent>
			<TabsContent value="tools">
				<Tools setChatBot={setChatBot} chatBot={chatBot} />
			</TabsContent>
			<TabsContent value="chats">
				<Chats chatBot={chatBot} />
			</TabsContent>
		</Tabs>
	)
}

export default TabsClient
