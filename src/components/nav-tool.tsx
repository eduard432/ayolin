'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const NavTabs = ({
	children,
	className,
	...props
}: React.ComponentProps<'div'>) => {
	return (
		<div
			{...props}
			className={cn(
				'inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
				className
			)}>
			{children}
		</div>
	)
}

export const NavTabTrigger = ({
	href,
	children,
	className,
	...props
}: React.ComponentProps<typeof Link>) => {
	const pathname = usePathname()
	const isActive = pathname === href

	return (
		<Link
			{...props}
			href={href}
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300',
				isActive
					? 'bg-white text-zinc-950 shadow dark:bg-zinc-950 dark:text-zinc-50'
					: 'text-zinc-500 dark:text-zinc-400',
				className
			)}>
			{children}
		</Link>
	)
}

export const NavTabContent = ({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) => {
	return (
		<div
			{...props}
			className={cn(
				'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300',
				className
			)}>
			{children}
		</div>
	)
}
