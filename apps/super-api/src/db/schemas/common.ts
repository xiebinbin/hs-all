import { timestamp, char } from "drizzle-orm/pg-core";
import { generateId } from "better-auth";

export const baseFields = {
    id:char("id", { length: 32 }).primaryKey().$defaultFn(() => generateId(32)),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
}