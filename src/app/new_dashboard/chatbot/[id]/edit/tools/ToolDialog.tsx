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

export function AddToolDialog({
	tool,
	setTool,
	saveTool,
	isUpdating = false,
	updateTool,
	initialSettings,
}: {
	tool: string
	setTool: React.Dispatch<React.SetStateAction<string>>
	saveTool: (settings: { [key: string]: string }) => void
	updateTool?: (settings: { [key: string]: string }) => void
	initialSettings?: { [key: string]: string }
	isUpdating?: boolean
}) {
	if (!tool) return

	const [settings, setSettings] = useState<{ [key: string]: string }>(
		Object.keys(aiPlugins[tool].settings).reduce((acc, key) => {
			acc[key] = ''
			return acc
		}, {} as { [key: string]: string })
	)

	const handleSave = () => {
		if (!isUpdating) {
			saveTool(settings)
		} else if (updateTool) {
			updateTool(settings)
		}
	}

	useEffect(() => {
		if (isUpdating && initialSettings) {
			setSettings(initialSettings)
		}
	}, [isUpdating])

	return (
		<Dialog onOpenChange={(isOpen) => !isOpen && setTool('')} open={!!tool}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Add tool: {aiPlugins[tool].name}</DialogTitle>
					<DialogDescription>{aiPlugins[tool].description}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col space-y-2">
					{Object.entries(aiPlugins[tool].settings).map(([key]) => (
						<div key={key} className="">
							<Label className="capitalize" htmlFor={key}>
								{key}:
							</Label>
							<Input
								value={settings[key]}
								onChange={(event) => {
									setSettings((prev) => ({
										...prev,
										[key]: event.target.value,
									}))
								}}
								id={key}
							/>
						</div>
					))}
				</div>
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
