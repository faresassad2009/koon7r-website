// koon7r-website/netlify/functions/index.ts
import { createHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

export const handler = createHandler({
  router: appRouter,
  createContext,
});
