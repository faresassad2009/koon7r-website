import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, orders, InsertOrder, Order, messages, InsertMessage, Message, customDesigns, InsertCustomDesign, settings, InsertSetting } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Order management functions
export async function createOrder(order: InsertOrder): Promise<Order | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order: database not available");
    return null;
  }

  try {
    await db.insert(orders).values(order);
    const result = await db.select().from(orders).where(eq(orders.id, order.id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return undefined;
  }

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user orders: database not available");
    return [];
  }

  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get all orders: database not available");
    return [];
  }

  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

// Message management functions
export async function createMessage(message: InsertMessage): Promise<Message | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create message: database not available");
    return null;
  }

  try {
    await db.insert(messages).values(message);
    const result = await db.select().from(messages).where(eq(messages.id, message.id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create message:", error);
    throw error;
  }
}

export async function getMessages(): Promise<Message[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get messages: database not available");
    return [];
  }

  return await db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function markMessageAsRead(id: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot mark message as read: database not available");
    return;
  }

  await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
}

// Settings management
export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get setting: database not available");
    return null;
  }

  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : null;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update setting: database not available");
    return;
  }

  const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);

  if (existing.length > 0) {
    await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
  }
}

// Custom designs
export async function saveCustomDesign(design: InsertCustomDesign): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save custom design: database not available");
    return;
  }

  try {
    await db.insert(customDesigns).values(design);
  } catch (error) {
    console.error("[Database] Failed to save custom design:", error);
    throw error;
  }
}
