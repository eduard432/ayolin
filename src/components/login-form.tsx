import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { redirect } from "next/navigation"
import { signIn, providerMap } from "@/auth"
import { AuthError } from "next-auth"

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>Login with your Apple or Google account</CardDescription>
				</CardHeader>
				<CardContent>
						<div className="grid gap-6">
							<div className="flex flex-col gap-4">
								{Object.values(providerMap).map((provider) => (
                                    <Button
                                        key={provider.id}
                                        variant="outline"
                                        className="w-full"
                                        onClick={async () => {
                                            'use server'
                                            try {
                                                await signIn(provider.id, {
                                                    redirectTo: '/dashboard',
                                                })
                                            } catch (error) {
                                                if (error instanceof AuthError) {
                                                    return redirect(`/?error=${error.type}`)
                                                }
                                                throw error
                                            }
                                        }}>
                                        <span>Sign in with {provider.name}</span>
                                    </Button>
                                ))}
							</div>
							<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
								<span className="relative z-10 bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
							<div className="grid gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="m@example.com" required />
								</div>
								<div className="grid gap-2">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
										<a
											href="#"
											className="ml-auto text-sm underline-offset-4 hover:underline">
											Forgot your password?
										</a>
									</div>
									<Input id="password" type="password" required />
								</div>
								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
							<div className="text-center text-sm">
								Don&apos;t have an account?{' '}
								<a href="#" className="underline underline-offset-4">
									Sign up
								</a>
							</div>
						</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
				By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
				<a href="#">Privacy Policy</a>.
			</div>
		</div>
	)
}
