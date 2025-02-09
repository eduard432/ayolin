import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Book,
	BookMarked,
	Bot,
	CheckCircle2,
	HandCoins,
	MessageSquareHeart,
	MoreVertical,
	Notebook,
	Search,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'

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

const ChatBotCard = ({
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
	)
}

export default function Page() {
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
					{chatbots.map((chatbot) => (
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
