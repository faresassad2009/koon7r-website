import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createOrder, getUserOrders, getAllOrders } from "./db";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  orders: router({
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerEmail: z.string().email().optional(),
          customerPhone: z.string().min(1),
          customerAddress: z.string().min(1),
          items: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              price: z.number(),
              size: z.string().optional(),
              image: z.string(),
              quantity: z.number(),
            })
          ),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const totalAmount = input.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const order = await createOrder({
          id: orderId,
          userId: ctx.user?.id,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          items: JSON.stringify(input.items),
          totalAmount,
          notes: input.notes,
          status: "pending",
        });

        // Notify owner about new order
        const itemsList = input.items
          .map((item) => `${item.name} (${item.size || "N/A"}) x${item.quantity} - $${item.price}`)
          .join("\n");

        await notifyOwner({
          title: `New Order: ${orderId}`,
          content: `Customer: ${input.customerName}\nPhone: ${input.customerPhone}\nEmail: ${input.customerEmail || "N/A"}\nAddress: ${input.customerAddress}\n\nItems:\n${itemsList}\n\nTotal: $${totalAmount}\n\nNotes: ${input.notes || "None"}`,
        });

        return order;
      }),

    myOrders: protectedProcedure.query(async ({ ctx }) => {
      return await getUserOrders(ctx.user.id);
    }),

    all: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getAllOrders();
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.string(),
          status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");

        const { orders } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.orderId));
        return { success: true };
      }),

    deleteOrder: protectedProcedure
      .input(z.object({ orderId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");

        const { orders } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        await db.delete(orders).where(eq(orders.id, input.orderId));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
