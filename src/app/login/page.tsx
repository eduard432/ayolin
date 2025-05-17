import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEnd } from "lucide-react"
import loginImage from "@/../public/login.png"

export default async function LoginPage(props: {
  searchParams: { callbackUrl?: string | undefined }
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={loginImage.src}
          alt="Login Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
    // <main className="flex items-center justify-center bg-neutral-50 text-neutral-950 h-screen">
    //   <div className="p-4 border rounded-md w-2/12  flex flex-col items-center gap-y-4">
    //   <h2 className="text-4xl text-center" >Login</h2>
    //   {Object.values(providerMap).map((provider) => (
    //     <form
    //       className=""
    //       key={provider.id}
    //       action={async () => {
    //         "use server"
    //         try {
    //           await signIn(provider.id, {
    //             redirectTo: props.searchParams?.callbackUrl ?? "/dashboard",
    //           })
    //         } catch (error) {
    //           // Signin can fail for a number of reasons, such as the user
    //           // not existing, or the user not having the correct role.
    //           // In some cases, you may want to redirect to a custom error
    //           if (error instanceof AuthError) {
    //             return redirect(`/?error=${error.type}`)
    //           }
 
    //           // Otherwise if a redirects happens Next.js can handle it
    //           // so you can just re-thrown the error and let Next.js handle it.
    //           // Docs:
    //           // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    //           throw error
    //         }
    //       }}
    //     >
    //       <button className="bg-neutral-950 text-neutral-50 px-8 py-1 rounded-md"  type="submit">
    //         <span>Sign in with {provider.name}</span>
    //       </button>
    //     </form>
    //   ))}
    //   </div>
    // </main>
  )
}