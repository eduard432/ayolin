import React, { Dispatch, SetStateAction } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	CheckCircle2,
	MessageSquare,
	MessagesSquare,
	MoreVertical,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChatBotRecord } from '@/types/ChatBot'

type ChatBotCardProps = {
	chatBot: ChatBotRecord
	setChatBots: Dispatch<SetStateAction<ChatBotRecord[]>>
}

export const ChatBotCard = ({ chatBot, setChatBots }: ChatBotCardProps) => {
	const handleDeleteData = async () => {
		const response = await fetch(`/api/chatbot/${chatBot._id}`, {
			method: 'DELETE',
		})
		if (response.ok) {
			setChatBots((data) => {
				const newData = [...data]
				const index = newData.findIndex((listedChatBot) => listedChatBot._id == chatBot._id)
				if (index > -1) {
					newData.splice(index, 1)
				}
				return newData
			})
		}
	}

	return (
			<Card className="flex flex-col">
				<CardHeader>
					<div className="flex justify-between items-start">
						<div className="flex items-center space-x-2">
							<CardTitle className="text-xl">{chatBot.name}</CardTitle>
							{'active' === 'active' ? (
								<CheckCircle2 className="h-5 w-5 text-green-500" />
							) : (
								<XCircle className="h-5 w-5 text-red-500" />
							)}
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild className="cursor-pointer" >
									<Link href={`/new_dashboard/chatbot/${chatBot._id}/edit/settings`}>Edit</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild className="cursor-pointer" >
									<Link href={`/new_dashboard/chatbot/${chatBot._id}/activity`}>View Analytics</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild className="cursor-pointer" >
									<Link href={`/new_dashboard/chat/${chatBot.defaultChatId}`}>Admin Chat</Link>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleDeleteData} className="text-red-600 cursor-pointer">
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<CardDescription>
						<p className="overflow-hidden h-4">{chatBot.initialPrompt}</p>
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-grow">
					<div className="flex justify-between">
						<div className="flex gap-2">
							<p className="text-gray-500 flex items-center">
								<MessageSquare className="h-4" />
								<span>{chatBot.totalMessages}</span>
							</p>
							<p className="text-gray-500 flex items-center">
								<MessagesSquare className="h-4" />
								<span>{chatBot.chats.length}</span>
							</p>
						</div>
						<p className="text-sm font-semibold">Model: {chatBot.model}</p>
					</div>
				</CardContent>
			</Card>
	)
}
