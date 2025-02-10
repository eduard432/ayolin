import React from 'react'
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

export const ChatBotCard = ({ chatbot }: { chatbot: ChatBotRecord }) => {
	return (
		<Link key={chatbot._id} href={`/new_dashboard/chatbot/${chatbot._id}/edit`}>
			<Card className="flex flex-col">
				<CardHeader>
					<div className="flex justify-between items-start">
						<div className="flex items-center space-x-2">
							<CardTitle className="text-xl">{chatbot.name}</CardTitle>
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
								<DropdownMenuItem>
									<Link href={`/chatbot/${chatbot._id}/edit`}>Edit</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href={`/chatbot/${chatbot._id}/analytics`}>View Analytics</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<CardDescription>
						<p className="overflow-hidden h-4">{chatbot.initialPrompt}</p>
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-grow">
					<div className="flex justify-between">
						<div className="flex gap-2">
							<p className="text-gray-500 flex items-center">
								<MessageSquare className="h-4" />
								<span>{chatbot.totalMessages}</span>
							</p>
							<p className="text-gray-500 flex items-center">
								<MessagesSquare className="h-4" />
								<span>{chatbot.chats.length}</span>
							</p>
						</div>
						<p className="text-sm font-semibold">Model: {chatbot.model}</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
