import { signIn } from "@/auth";

import React from "react";

const SignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
          redirectTo: "/dashboard",
        });
      }}
    >
      <button className="px-2 bg-neutral-50 py-1 font-semibold text-neutral-950 rounded-md" type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
