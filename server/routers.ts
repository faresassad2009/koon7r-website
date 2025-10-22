import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createOrder, getUserOrders, getAllOrders, createMessage, getMessages, markMessageAsRead, getSetting, updateSetting, saveCustomDesign } from "./db";
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
    adminLogin: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Admin credentials not configured",
          });
        }

        if (input.email !== adminEmail || input.password !== adminPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, "admin_session", cookieOptions);

        return { success: true };
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

        // Send Telegram notification
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;
        if (telegramToken && telegramChatId) {
          try {
            const message = `New Order: ${orderId}\n\nCustomer: ${input.customerName}\nPhone: ${input.customerPhone}\nEmail: ${input.customerEmail || "N/A"}\nAddress: ${input.customerAddress}\n\nItems:\n${itemsList}\n\nTotal: $${totalAmount}\n\nNotes: ${input.notes || "None"}`;
            
            // Send text message first
            await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
              }),
            });

            // Send images for custom design items
            for (const item of input.items) {
              if (item.name.toLowerCase().includes("custom") && item.image) {
                try {
                  // Check if image is base64 data URL
                  if (item.image.startsWith("data:image")) {
                    // Convert base64 to buffer
                    const base64Data = item.image.split(",")[1];
                    const buffer = Buffer.from(base64Data, "base64");
                    
                    // Create form data for photo upload
                    const FormData = (await import("form-data")).default;
                    const formData = new FormData();
                    formData.append("chat_id", telegramChatId);
                    formData.append("photo", buffer, {
                      filename: `${item.name.replace(/\s+/g, "_")}.png`,
                      contentType: "image/png",
                    });
                    formData.append("caption", `${item.name} - Size: ${item.size || "N/A"}`);

                    await fetch(`https://api.telegram.org/bot${telegramToken}/sendPhoto`, {
                      method: "POST",
                      body: formData,
                    });
                  }
                } catch (imgError) {
                  console.error("Failed to send custom design image:", imgError);
                }
              }
            }
          } catch (error) {
            console.error("Failed to send Telegram notification:", error);
          }
        }

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

  messages: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const msg = await createMessage({
          id: messageId,
          name: input.name,
          email: input.email,
          message: input.message,
        });

        // Send Telegram notification
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;
        if (telegramToken && telegramChatId) {
          try {
            await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: telegramChatId,
                text: `New Message from ${input.name}\n\nEmail: ${input.email}\n\nMessage:\n${input.message}`,
              }),
            });
          } catch (error) {
            console.error("Failed to send Telegram notification:", error);
          }
        }

        return msg;
      }),

    all: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return await getMessages();
    }),

    markAsRead: protectedProcedure
      .input(z.object({ messageId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await markMessageAsRead(input.messageId);
        return { success: true };
      }),
  }),

  settings: router({
    get: protectedProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return await getSetting(input.key);
      }),

    update: protectedProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await updateSetting(input.key, input.value);
        return { success: true };
      }),
  }),

  customDesign: router({
    save: publicProcedure
      .input(
        z.object({
          orderId: z.string(),
          frontDesignUrl: z.string().optional(),
          backDesignUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const designId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await saveCustomDesign({
          id: designId,
          orderId: input.orderId,
          frontDesignUrl: input.frontDesignUrl,
          backDesignUrl: input.backDesignUrl,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

