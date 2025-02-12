import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import MDEditor from '@uiw/react-md-editor'
import React from 'react'

export const Settings = () => {
	return (
		<form className="max-w-2xl grid gap-4">
			<div className="grid gap-2">
				<Label htmlFor="name">Name:</Label>
				<Input name="name" type="text" />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="model">Model:</Label>
				<Select defaultValue="gpt-3.5-turbo">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select:" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
						<SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
						<SelectItem value="gpt-4">gpt-4</SelectItem>
						<SelectItem value="gpt-4o">gpt-4o</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="grid gap-2" >
        <Label htmlFor="initialPrompt">Initial Prompt:</Label>
				<Textarea rows={3} name="initialPrompt" />
			</div>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" >Descartar</Button>
        <Button>Guardar</Button>
      </div>
		</form>
	)
}
