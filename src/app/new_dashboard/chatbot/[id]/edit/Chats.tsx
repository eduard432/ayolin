import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenuTrigger,DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
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
import { MoreVertical, Search } from 'lucide-react'

const chats = [
	{
		id: '1',
		name: 'Alice Johnson',
		avatar: '/placeholder.svg?height=32&width=32',
		lastMessage: "Sure, let's meet tomorrow at 10 AM",
		status: 'active',
		lastActive: '2 mins ago',
	},
	{
		id: '2',
		name: 'Bob Smith',
		avatar: '/placeholder.svg?height=32&width=32',
		lastMessage: 'Thanks for your help!',
		status: 'active',
		lastActive: '5 mins ago',
	},
	{
		id: '3',
		name: 'Carol Williams',
		avatar: '/placeholder.svg?height=32&width=32',
		lastMessage: 'The project is now complete',
		status: 'archived',
		lastActive: '2 hours ago',
	},
	{
		id: '4',
		name: 'David Brown',
		avatar: '/placeholder.svg?height=32&width=32',
		lastMessage: "I'll review the documents",
		status: 'active',
		lastActive: '1 day ago',
	},
	{
		id: '5',
		name: 'Eve Davis',
		avatar: '/placeholder.svg?height=32&width=32',
		lastMessage: 'Looking forward to our meeting',
		status: 'archived',
		lastActive: '1 week ago',
	},
]

export const Chats = () => {
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
						{chats.map((chat) => (
							<TableRow className="py-4">
								<TableCell className="flex gap-4">
									<Avatar className="bg-zinc-200" />
									<div>
										<p className="font-semibold">{chat.name}</p>
										<p>{chat.lastMessage}</p>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant={chat.status === 'active' ? 'default' : 'secondary'}
										className={`min-w-16 justify-center rounded-full`}>
										{chat.status}
									</Badge>
								</TableCell>
								<TableCell>{chat.lastActive}</TableCell>
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
						))}
					</TableBody>
				</Table>
			</section>
		</div>
	)
}
