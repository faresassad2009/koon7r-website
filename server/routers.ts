
طيب بس اعمل custom order ليش ما بوصلني الصورة مع المكان يلي حطه على التيشيرت
دعني أفحص كود Custom Design لأفهم المشكلة في عدم إرسال الصورة والموضع.
تم تحليل بنية المستودع واكتشاف أن المشروع يستخدم React وTypeScript، وكتبت تقرير شامل عن التقنيات والميزات، وسأواصل فحص كود CustomDesignSection لفهم مشكلة عدم إرسال الصورة والموضع.

وجدت المشكلة!
عندما يضيف المستخدم تصميم مخصص إلى السلة، الكود حالياً يحفظ فقط صورة التصميم (الصورة اللي رفعها المستخدم) لكن لا يحفظ:
موضع التصميم على التيشيرت (position)
حجم التصميم (scale)
دوران التصميم (rotation)
هل التصميم على الوجه الأمامي أو الخلفي
المشكلة في السطر 112 من CustomDesignSection.tsx:
TypeScript
image: frontDesign || backDesign || "",
هذا يرسل فقط الصورة الأصلية، لكن لا يرسل معلومات الموضع والحجم والدوران.
الحل المقترح:
إنشاء صورة نهائية (screenshot) للتصميم كما يظهر على التيشيرت
أو حفظ جميع معلومات التصميم (position, scale, rotation) في الطلب
هل تريدني أن أصلح هذه المشكلة؟
بدي يحفظلي الصورة يلي رفعها المستخدم وتكون فوق صورة التيشيرت الاصلية يلي موجودة بالموقع فهمت علي.
اقتراح معرفة جديدة
فهمت عليك تماماً! بدك لما المستخدم يعمل custom order، يتم حفظ صورة نهائية تجمع بين:
صورة التيشيرت الأصلية (من الموقع)
التصميم اللي رفعه المستخدم فوقها
بنفس الموضع والحجم والدوران اللي حطهم
يعني screenshot للتصميم النهائي كما يظهر في الـ preview.
رح أصلح الكود الآن.
تمام! عدلت الكود. الآن لما المستخدم يضيف تصميم مخصص للسلة، رح يتم:
إنشاء صورة مركبة تجمع بين صورة التيشيرت الأصلية والتصميم اللي رفعه المستخدم
حفظ الموضع والحجم والدوران - الصورة النهائية رح تكون بنفس الشكل اللي شافه المستخدم في الـ preview
إرسال الصورة المركبة مع الطلب، فأنت كصاحب الموقع رح تشوف بالضبط كيف بدو التصميم
الكود الجديد بيستخدم HTML Canvas لدمج الصورتين مع بعض قبل ما يضيفها للسلة.
بدك تجرب الكود أو في شي تاني بدك تعدله؟
وين الكود ووبين احطه؟
الكود موجود في المشروع اللي عندك! خليني أوريك وين بالضبط:
الملف: client/src/components/sections/CustomDesignSection.tsx
أنا عدلت الكود مباشرة في المشروع. رح أرسلك الملف المعدل كامل عشان تستبدله بالملف القديم عندك.
حصلت على تحديث الكود ليحفظ صورة مركبة تجمع بين التيشيرت والتصميم مع حفظ موضع، حجم، ودوران التصميم كما ظهر في المعاينة. سأقوم باستبدال الملف الحالي.

تمام! جهزتلك كل شي:
الملفات المرفقة:
CustomDesignSection-UPDATED.tsx - الملف المعدل الكامل
instructions.md - تعليمات التطبيق بالتفصيل
كيف تطبق التعديل:
روح على مشروعك koon7r-website
افتح المسار: client/src/components/sections/
استبدل ملف CustomDesignSection.tsx القديم بالملف الجديد المرفق
شغل المشروع: pnpm dev
جرب Custom Design وشوف النتيجة!
التعديل الرئيسي:
أضفت دالة captureDesignImage() اللي بتدمج صورة التيشيرت مع التصميم اللي رفعه المستخدم، وبترسل الصورة المركبة النهائية مع الطلب.
الآن لما يوصلك طلب، رح تشوف بالضبط شو شكل التصميم اللي بدو الزبون! 🎨✨
CustomDesignSection-UPDATED.tsx
رمز · 17.50 KB
تعليمات تطبيق التعديل
Markdown · 3.21 KB

عرض جميع الملفات في هذه المهمة
لسا ما وصلت الصورة على التيليجرام
آه صح! التعديل اللي عملته بيحفظ الصورة المركبة في الطلب بس ما بيرسلها على التليجرام.
خليني أشوف كود إرسال التليجرام وأعدله عشان يرسل الصورة كمان.
تم تعديل كود التليجرام ليشمل إرسال الصور المخصصة عبر البوت، باستخدام صيغة FormData وتحويل الصور من البيانات المشفرة، لضمان عرض التصاميم بشكل صحيح.

قمت بالتحقق من وجود مكتبة form-data في التبعيات، وأضفتها إلى ملف package.json لضمان دعم إرسال الصور المخصصة عبر البوت. سأتابع الآن استنساخ وتحليل المشروع.

تمام! الآن عدلت كمان كود التليجرام عشان يرسل الصورة المركبة.
الملفات المرفقة (3 ملفات):
CustomDesignSection-UPDATED.tsx (من الرسالة السابقة)
routers-UPDATED.ts (جديد) ← كود إرسال الصور على التليجرام
package-UPDATED.json (جديد) ← إضافة مكتبة form-data
instructions-complete.md ← تعليمات كاملة خطوة بخطوة
التعديلات الجديدة:
في routers.ts:
بعد إرسال رسالة الطلب النصية، الكود بيفحص كل منتج
إذا كان المنتج "Custom" وفيه صورة، بيحولها من base64 لـ buffer
بيرسلها كصورة على التليجرام مع caption فيه اسم المنتج والمقاس
في package.json:
أضفت مكتبة form-data اللي بتستخدم لإرسال الصور
كيف تطبق:
Bash
# 1. استبدل الملفات الثلاثة
# 2. نزل المكتبات الجديدة
pnpm install

# 3. شغل المشروع
pnpm dev
الآن لما يوصلك طلب custom design، رح توصلك على التليجرام:
📝 رسالة نصية بتفاصيل الطلب
🖼️ صورة التصميم المركب (التيشيرت + التصميم بموضعه الصحيح)
جرب وخبرني إذا اشتغل! 🚀
routers-UPDATED.ts
رمز · 10.71 KB
package-UPDATED.json
رمز · 3.72 KB
تعليمات كاملة لإرسال صور التصميم المخصص على التليجرام
Markdown · 6.35 KB

عرض جميع الملفات في هذه المهمة
تم إكمال المهمة
كيف كانت هذه النتيجة؟
اقتراحات للمتابعة
إرسال رسالة إلى Manus
routers-UPDATED.ts
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

Koon7r Website GitHub Repository - Manus
