'use client'
import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenuTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { ChatBotRecord } from '@/types/ChatBot'
import { MoreVertical, Search } from 'lucide-react'
import { ChatRecord } from '@/types/Chat'
import { Skeleton } from '@/components/ui/skeleton'
import { useChatBot } from '../ChatBotContext'

export default function ChatPage() {
	const { chatBot } = useChatBot()

	const [chats, setChats] = useState<ChatRecord[]>()

	const getChats = async (id: string) => {
		const response = await fetch(`/api/chatbot/${id}/chats`)

		if (response.ok) {
			const { chats }: { chats: ChatRecord[] } = await response.json()
			console.log({ chats })
			setChats(chats)
		}
	}

	useEffect(() => {
		getChats(chatBot._id)
	}, [])

	return (
		<div className="max-w-7xl flex flex-col gap-4">
			<section className="flex w-full max-w-2xl items-center space-x-2">
				<div className="w-full relative">
					<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
					<Input type="text" placeholder="Search for Chats" className="pl-8" />
				</div>
			</section>
			<section className="">
				<Table>
					<TableCaption>A list of your recent invoices.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="">Chat</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Last Active</TableHead>
							<TableHead className="">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{chats ? (
							chats.map((chat) => (
								<TableRow className="py-4">
									<TableCell className="flex gap-4">
										<Avatar className="bg-zinc-200" />
										<div>
											<p className="font-semibold">{chat.name || 'Anonymus'}</p>
											<p className="overflow-hidden">{chat.messages[0]?.content || ''}</p>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant={'active' === 'active' ? 'default' : 'secondary'}
											className={`min-w-16 justify-center rounded-full`}>
											{'active'}
										</Badge>
									</TableCell>
									<TableCell>{chat.lastActive && '0 min'}</TableCell>
									<TableCell className="">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<MoreVertical className="h-4 w-4" />
													<span className="sr-only">Actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>View Chat</DropdownMenuItem>
												<DropdownMenuItem>View Profile</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="text-red-600">
													Delete Chat
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						) : (
							<>
								{[...Array(5)].map(() => (
									<TableRow className="animate-pulse bg-zinc-100 py-4">
										<TableCell className="flex gap-4">
											<Avatar className="bg-zinc-200" />
											<div className="bg-zinc-200 text-zinc-200 px-2 rounded-md">
												<p className=" font-semibold">{'Anonymus'}</p>
												<p className="*:rounded-md overflow-hidden">
													Lorem ipsum dolor sit amet consectetur adipisicing elit.
												</p>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant={'active' === 'active' ? 'default' : 'secondary'}
												className={`min-w-16 justify-center rounded-full bg-zinc-200 text-zinc-200`}>
												{'active'}
											</Badge>
										</TableCell>
										<TableCell>
											<p className="bg-zinc-200 text-zinc-200 px-2 rounded-md">
												{'0 min'}
											</p>
										</TableCell>
										<TableCell className=""></TableCell>
									</TableRow>
								))}
							</>
						)}
					</TableBody>
				</Table>
			</section>
		</div>
	)
}
