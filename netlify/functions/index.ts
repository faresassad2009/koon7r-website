// netlify/functions/index.ts
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "../../routers";
import { createContext } from "../../server/_core/context";

// ننشئ Express app
const app = express();

// body parser عشان يقدر يتعامل مع JSON كبير
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// TRPC middleware
app.use(
  "/.netlify/functions/index",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// نصدر التطبيق كـ Netlify Function
export default app;

