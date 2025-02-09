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
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const ChatBotCard = ({
	chatbot,
}: {
	chatbot: {
		id: string
		name: string
		status: string
		description: string
		createdAt: string
		model: string
	}
}) => {
	return (
		<Link href={`/dashboard/edit/${chatbot.id}`}>
			<Card key={chatbot.id} className="flex flex-col">
				<CardHeader>
					<div className="flex justify-between items-start">
						<div className="flex items-center space-x-2">
							<CardTitle className="text-xl">{chatbot.name}</CardTitle>
							{chatbot.status === 'active' ? (
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
									<Link href={`/chatbot/${chatbot.id}/edit`}>Edit</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href={`/chatbot/${chatbot.id}/analytics`}>View Analytics</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<CardDescription className="h-4 overflow-hidden">
						{chatbot.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-grow">
					<div className="flex justify-between">
						<p className="text-sm text-gray-500">
							Created: {new Date(chatbot.createdAt).toLocaleDateString()}
						</p>
						<p className="text-sm font-semibold">Model: {chatbot.model}</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
