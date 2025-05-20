import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Book, Bot, HandCoins, MessageSquareHeart, Notebook, Search } from 'lucide-react'
import { auth } from '@/auth'
import { getChatbots } from '@/services/chatbot.service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ChatBots from '../ChatBots'

export default async function Page() {
	const session = await auth()

	if (!session?.user || !session.user.id) return redirect('/')
	const chatBots = await getChatbots(session.user.id)

	return (
		<main>
			<Header title={{ content: 'Chat Bots' }} />
			<section className="p-4 pt-0 flex w-full max-w-2xl items-center space-x-2">
				<div className="w-full relative">
					<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
					<Input type="text" placeholder="Search for Chat Bots" className="pl-8" />
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>Add New</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild >
							<Link href="/dashboard/chatbot/new">
								<Bot />
								Custom
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Book />
							RAG
						</DropdownMenuItem>
						<DropdownMenuItem>
							<HandCoins />
							Sales
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Notebook />
							Educator
						</DropdownMenuItem>
						<DropdownMenuItem>
							<MessageSquareHeart />
							Friend
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>
			<section className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<ChatBots chatBots={chatBots} />
			</section>
		</main>
	)
}
