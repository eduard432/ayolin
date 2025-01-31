import { signOut } from '@/auth'
import React from 'react'

const SignOut = ({
	children,
	className,
}: Readonly<{
	children: React.ReactNode
	className?: string
}>) => {
	return (
		<form
			action={async () => {
				'use server'
				await signOut({
          redirectTo: '/login'
        })
			}}>
			<button className={className} type="submit">
				{children}
			</button>
		</form>
	)
}

export default SignOut
