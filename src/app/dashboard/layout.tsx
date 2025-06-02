import { auth } from '@/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { redirect } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardProvider } from './DashboardProvider'
import { SessionProvider } from 'next-auth/react'

export default async function NewDashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth()
	if (!session?.user || !session.user.id) return redirect('/')

	return (
		<SessionProvider refetchInterval={60*60*3} session={session}refetchOnWindowFocus={false}>
			<DashboardProvider>
				<SidebarProvider>
					<AppSidebar
						user={{
							name: session.user.name || '',
							avatar: session.user.image || '',
							email: session.user.email || '',
						}}
					/>
					<SidebarInset>{children}</SidebarInset>
				</SidebarProvider>
			</DashboardProvider>
		</SessionProvider>
	)
}
