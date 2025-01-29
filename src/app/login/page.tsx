import { redirect } from "next/navigation"
import { signIn, providerMap } from "@/auth"
import { AuthError } from "next-auth"
 
export default async function LoginPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  return (
    <main className="flex items-center justify-center bg-neutral-50 text-neutral-950 h-screen">
      <div className="p-4 border rounded-md w-2/12  flex flex-col items-center gap-y-4">
      <h2 className="text-4xl text-center" >Login</h2>
      {Object.values(providerMap).map((provider) => (
        <form
          className=""
          key={provider.id}
          action={async () => {
            "use server"
            try {
              await signIn(provider.id, {
                redirectTo: props.searchParams?.callbackUrl ?? "/dashboard",
              })
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                return redirect(`/?error=${error.type}`)
              }
 
              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error
            }
          }}
        >
          <button className="bg-neutral-950 text-neutral-50 px-8 py-1 rounded-md"  type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
      </div>
    </main>
  )
}