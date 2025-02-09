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
import { ChatBotCard } from './ChatBotCard'
import { auth } from '@/auth'
import { getChatbots } from '@/app/services/server/chatbotService'
import { redirect } from 'next/navigation'

const chatbots = [
	{
		id: '1',
		name: 'Customer Support Bot',
		description: 'Handles customer inquiries and support tickets',
		createdAt: '2023-04-01',
		status: 'active',
		model: 'GPT-4',
	},
	{
		id: '2',
		name: 'Sales Assistant',
		description: 'Helps with product recommendations and sales inquiries',
		createdAt: '2023-04-15',
		status: 'active',
		model: 'GPT-3.5',
	},
	{
		id: '3',
		name: 'Onboarding Guide',
		description: 'Assists new users with platform onboarding',
		createdAt: '2023-05-01',
		status: 'inactive',
		model: 'GPT-3.5',
	},
]

export default async function Page() {
	const session = await auth()

	if (!session?.user || !session.user.id) return redirect('/')
	const chatBots = await getChatbots(session.user.id)

	return (
		<>
			<Header title="Chat Bots" />
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
						<DropdownMenuItem>
							<Bot />
							Custom
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
				<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
					{chatBots.map((chatbot) => (
						<ChatBotCard chatbot={chatbot} />
					))}

					<div className=" rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
					<div className="aspect-video rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
					<div className="aspect-video rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50" />
				</div>
				<div className="min-h-[100vh] flex-1 rounded-xl bg-zinc-100/50 md:min-h-min dark:bg-zinc-800/50" />
			</section>
		</>
	)
}
