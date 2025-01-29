import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import client from "./lib/db";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [GitHub];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    maxAge: 60 * 60 * 24,
    strategy: 'database'
  },
  adapter: MongoDBAdapter(client, {
    databaseName: 'chatbot_db'
  }),
  providers,
  pages: {
    signIn: '/login'
  }
});
