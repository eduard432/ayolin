import { auth } from "@/auth"
import SignOut from "@/components/signout-button"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FaArrowRightFromBracket } from "react-icons/fa6"

export const metadata: Metadata = {
    title: "Ayolin DashBoard",
  };
  

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {

    const session = await auth()
    if (!session?.user || !session.user.id) return redirect('/')

	return (
		<>
			<nav className="flex items-center justify-between bg-neutral-50 border-b border-neutral-200 text-neutral-950 px-12 py-2" >
                <Link href="/dashboard" className="text-xl font-mono bg-neutral-700 text-neutral-50 px-2 py-1 rounded" >Ayolin Dashboard</Link>
                <div className="flex items-center gap-4" >
                    <p>{session.user.name}</p>
                    <img className="rounded-full w-10 h-10" src={session.user.image || ''} alt="user avatar image" />
                    <SignOut className=" p-2 rounded-md hover:bg-neutral-300 flex items" >
                        <FaArrowRightFromBracket  />
                    </SignOut>
                </div>
            </nav>
			<>{children}</>
		</>
	)
}
