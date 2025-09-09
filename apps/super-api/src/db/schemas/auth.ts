import * as p from "drizzle-orm/pg-core";
import { baseFields } from "./common";
import { generateId } from "better-auth";
import { relations } from "drizzle-orm";
/**
 * 用户角色枚举
 */
export const UserRoleEnum = {
    USER: "user",
    ADMIN: "admin",
    MODERATOR: "moderator",
} as const;
export type UserRole = typeof UserRoleEnum[keyof typeof UserRoleEnum];

/**
 * 用户表
 * 存储用户基本信息、认证状态、流量统计等
 */
export const UserTable = p.pgTable("users", {
    ...baseFields,
    /** 用户真实姓名 */
    name: p.text("name").notNull(),
    /** 用户名，系统自动生成，唯一 */
    username: p.text("username").notNull().unique().$defaultFn(() => generateId(16).toLowerCase()),
    /** 显示用户名，用户可自定义 */
    displayUsername: p.text("display_username").$defaultFn(() => generateId(16).toLowerCase()),
    /** 邮箱地址，唯一，用于登录和通知 */
    email: p.text("email").notNull().unique(),
    /** 邮箱是否已验证 */
    emailVerified: p.boolean("email_verified").default(false).notNull(),
    /** 手机号码，唯一 */
    phoneNumber: p.text("phone_number").unique(),
    /** 手机号是否已验证 */
    phoneNumberVerified: p.boolean("phone_number_verified").default(false).notNull(),
    /** 用户头像URL */
    image: p.text("image"),
    /** 用户角色：user, admin, moderator */
    role: p.text("role").notNull().default(UserRoleEnum.USER),
    /** 用户是否被禁用 */
    banned: p.boolean("banned").default(false).notNull(),
    /** 禁用原因 */
    banReason: p.text("ban_reason"),
    /** 禁用过期时间 */
    banExpires: p.date("ban_expires"),
});
export type User = typeof UserTable.$inferSelect;
export type UserInsert = typeof UserTable.$inferInsert;

export const userRelations = relations(UserTable, ({ many }) => ({
    sessions: many(SessionTable),
    accounts: many(AccountTable),
}));

/**
 * 会话表
 * 管理用户登录会话和状态
 */
export const SessionTable = p.pgTable("sessions", {
    ...baseFields,
    /** 会话过期时间 */
    expiresAt: p.timestamp("expires_at").notNull(),
    /** 会话令牌，唯一 */
    token: p.text("token").notNull().unique(),
    /** 用户IP地址 */
    ipAddress: p.text("ip_address"),
    /** 用户代理字符串 */
    userAgent: p.text("user_agent"),
    /** 模拟用户ID（管理员功能） */
    impersonatedBy: p.char("impersonated_by", { length: 32 }),
    /** 关联的用户ID */
    userId: p.char("user_id", { length: 32 }).notNull(),
});

export const sessionRelations = relations(SessionTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [SessionTable.userId],
        references: [UserTable.id],
    }),
}));

/**
 * 账户表
 * 存储第三方认证账户信息和密码
 */
export const AccountTable = p.pgTable("accounts", {
    ...baseFields,
    /** 第三方账户ID */
    accountId: p.char("account_id", { length: 32 }).notNull(),
    /** 认证提供商ID */
    providerId: p.char("provider_id", { length: 32 }).notNull(),
    /** 关联的用户ID */
    userId: p.char("user_id", { length: 32 }).notNull(),
    /** OAuth访问令牌 */
    accessToken: p.text("access_token"),
    /** OAuth刷新令牌 */
    refreshToken: p.text("refresh_token"),
    /** OAuth身份令牌 */
    idToken: p.text("id_token"),
    /** 访问令牌过期时间 */
    accessTokenExpiresAt: p.timestamp("access_token_expires_at"),
    /** 刷新令牌过期时间 */
    refreshTokenExpiresAt: p.timestamp("refresh_token_expires_at"),
    /** 权限范围 */
    scope: p.text("scope"),
    /** 加密后的密码 */
    password: p.text("password"),
});

export const accountRelations = relations(AccountTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [AccountTable.userId],
        references: [UserTable.id],
    }),
}));

/**
 * 验证表
 * 存储邮箱和手机验证码
 */
export const VerificationTable = p.pgTable("verifications", {
    ...baseFields,
    /** 验证记录唯一标识符 */
    id: p.char("id", { length: 32 }).primaryKey().$defaultFn(() => generateId(32)),
    /** 验证标识符（邮箱或手机号） */
    identifier: p.text("identifier").notNull(),
    /** 验证码或令牌 */
    value: p.text("value").notNull(),
    /** 验证码过期时间 */
    expiresAt: p.timestamp("expires_at").notNull(),
});
