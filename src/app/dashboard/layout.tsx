import { auth } from '@/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { redirect } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardProvider } from './DashboardProvider'


export default async function NewDashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth()
	if (!session?.user || !session.user.id) return redirect('/')

	return (
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
	)
}
