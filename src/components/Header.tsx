import React from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import Link from 'next/link'

const Header = ({
	title = {
		content: 'Building Your Application',
	},
	subTitle,
}: {
	title: {
		content: string
		url?: string
	}
	subTitle?: string
}) => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink asChild>
								{title.url ? (
									<Link href={title.url}>{title.content}</Link>
								) : (
									<span>{title.content}</span>
								)}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{subTitle && (
							<>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>{subTitle}</BreadcrumbPage>
								</BreadcrumbItem>
							</>
						)}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	)
}

export default Header
