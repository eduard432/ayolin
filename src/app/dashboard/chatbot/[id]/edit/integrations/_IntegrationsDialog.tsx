'use client'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { aiPlugins } from '@/ai/plugins'
import { integrations } from './_page'
import {PhoneInput} from '@/components/phone-input'
import { Badge } from '@/components/ui/badge'

export function AddToolDialog({
	integration,
	setIntegration,
	saveIntegration,
	isUpdating = false,
	updateIntegration,
	initialUsers,
	setIsUpdating,
}: {
	integration: string
	setIntegration: React.Dispatch<React.SetStateAction<string>>
	saveIntegration: (users: string[]) => void
	updateIntegration?: (users: string[]) => void
	initialUsers?: string[]
	isUpdating?: boolean
	setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const [users, setUsers] = useState<string[]>([])

	const [currentUser, setCurrentUser] = useState<string>('')
	const [error, setError] = useState('')

	const addCurrentUser = () => {
		if (!currentUser.trim()) return
		setUsers((prevUsers) => [...prevUsers, currentUser.trim()])
		setCurrentUser('')
	}

	const removeUser = (user: string) => {
		setUsers((prevUsers) => prevUsers.filter((u) => u !== user))
	}

	const handleSave = () => {
		if (!isUpdating) {
			saveIntegration(users)
		} else if (updateIntegration) {
			updateIntegration(users)
		}
	}

	useEffect(() => {
		if (isUpdating && initialUsers) {
			setUsers(initialUsers)
		}
	}, [isUpdating, initialUsers])

	useEffect(() => {
		console.log({ integration, isUpdating, notIntegration: !!integration })
	}, [integration, isUpdating])

	if (!integration) return null

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setIsUpdating(false)
					setIntegration('')
				}
			}}
			open={!!integration}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Add tool: {integrations[integration].name}</DialogTitle>
					<DialogDescription>{integrations[integration].description}</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(event) => event.preventDefault()}
					className="flex flex-col space-y-2">
					<Label htmlFor="phone">Phone Number</Label>
					<div className="flex gap-2">
						<PhoneInput
						international
						value={currentUser}
						onChange={(value) => setCurrentUser(value)}
						/>
						<Button onClick={addCurrentUser}>Add</Button>
					</div>
					<p className="text-sm h-4 text-red-600 capitalize">{error}</p>
					<div className="min-h-16 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300">
						{users.map((user) => (
							<Badge
								key={user}
								onDoubleClick={() => removeUser(user)}
								title="Double click to remove"
								className="mx-1 select-none cursor-pointer"
								variant="outline">
								{user}
							</Badge>
						))}
					</div>
				</form>
				<DialogFooter className="sm:justify-start">
					<Button onClick={() => handleSave()}>Save</Button>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default AddToolDialog
