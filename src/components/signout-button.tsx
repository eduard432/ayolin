import { signOut } from '@/auth';
import React from 'react'

const SignOut = () => {
  return (
    <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="px-2 bg-neutral-50 py-1 font-semibold text-neutral-950 rounded-md" type="submit">Sign Out</button>
        </form>
  )
}

export default SignOut