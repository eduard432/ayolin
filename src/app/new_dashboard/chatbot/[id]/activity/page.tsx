"use client"

import React, { useMemo } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { FaDollarSign, FaRegMessage, FaRegComments, FaA  } from 'react-icons/fa6'
import { useChatBot } from '../ChatBotContext'
import { AI_MODELS } from '@/lib/aiModels'

const AcitivityPage = () => {
	const { chatBot } = useChatBot()
	
	const totalUsage = useMemo<number>(() => {
		const modelRates = AI_MODELS[chatBot.model]
		if (!modelRates) return 0

		const inputUsage = (AI_MODELS[chatBot.model][0] / 1000000) * chatBot.usedTokens.input
		const outputUsage = (AI_MODELS[chatBot.model][1] / 1000000) * chatBot.usedTokens.output
		return inputUsage + outputUsage
	}, [chatBot.usedTokens.input, chatBot.usedTokens.output])

	return (
		<div className="max-w-7xl grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Usage:</CardTitle>
					<FaDollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">${totalUsage.toLocaleString('es-Mx', {
						notation: 'compact'
					})}</div>
					<p className="text-xs text-muted-foreground">+00.0% from last month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Messages:</CardTitle>
					<FaRegMessage className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{chatBot.totalMessages}</div>
					<p className="text-xs text-muted-foreground">+00.0% from last month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Chats:</CardTitle>
					<FaRegComments className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{chatBot.chats.length}</div>
					<p className="text-xs text-muted-foreground">+00.0% from last month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total tokens:</CardTitle>
					<FaA className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{chatBot.usedTokens.input + chatBot.usedTokens.output}</div>
					<p className="text-xs text-muted-foreground">+00.0% from last moht</p>
				</CardContent>
			</Card>
			<Card className="md:col-span-2">
				<CardHeader>
					<CardTitle>Overview</CardTitle>
				</CardHeader>
				<CardContent className="pl-2">{/* <Overview /> */}</CardContent>
			</Card>
			<Card className="md:col-span-2">
				<CardHeader>
					<CardTitle>Recent Sales</CardTitle>
					<CardDescription>You made 265 sales this month.</CardDescription>
				</CardHeader>
				<CardContent>{/* <RecentSales /> */}</CardContent>
			</Card>
		</div>
	)
}

export default AcitivityPage
