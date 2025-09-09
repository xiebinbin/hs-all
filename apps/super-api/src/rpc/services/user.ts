import { db } from "@/db";
import { UserTable, AccountTable, UserRoleEnum } from "@/db/schemas/auth";
import { eq, and } from "drizzle-orm";
import { generateId } from "better-auth";
import bcrypt from "bcryptjs";
import { RpcContext } from '@/types/jsonrpc';
import { RpcErrors } from '@/rpc/constants/errors';
import { logger } from '@/utils/logger';

/**
 * 用户管理服务
 * 绕过 Better Auth 接口，直接操作数据库进行用户管理
 */
export class UserService {
    async create(params: {
        username: string;
        password: string;
        phone: string;
    }) {
        const { name, email, password, phoneNumber, role, emailVerified, phoneNumberVerified, displayUsername, inviteBy, trafficLimit, deviceLimit, speedLimit } = ctx.params;
    }
    /**
     * 创建用户
     * 直接操作数据库，绕过 Better Auth 的接口
     */
    async createUser(params: {
        name: string;
        email: string;
        password?: string;
        phoneNumber?: string;
        role?: UserRole;
        emailVerified?: boolean;
        phoneNumberVerified?: boolean;
        displayUsername?: string;
        inviteBy?: string;
        trafficLimit?: {
            up: number;
            down: number;
            total: number;
            remaining: number;
        };
        deviceLimit?: number;
        speedLimit?: number;
    }) {
        const {
            name,
            email,
            password,
            phoneNumber,
            role = UserRoleEnum.USER,
            emailVerified = false,
            phoneNumberVerified = false,
            displayUsername,
            inviteBy,
            trafficLimit = { up: 0, down: 0, total: 0, remaining: 0 },
            deviceLimit = 0,
            speedLimit = 0
        } = params;

        // 验证必需参数
        if (!name || !email) {
            throw RpcErrors.invalidParams({
                message: 'Name and email are required'
            });
        }

        // 检查邮箱是否已存在
        const existingUser = await db.select({ id: UserTable.id })
            .from(UserTable)
            .where(eq(UserTable.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            throw RpcErrors.validationError({
                message: 'Email already exists'
            });
        }

        // 检查手机号是否已存在
        if (phoneNumber) {
            const existingPhone = await db.select({ id: UserTable.id })
                .from(UserTable)
                .where(eq(UserTable.phoneNumber, phoneNumber))
                .limit(1);

            if (existingPhone.length > 0) {
                throw RpcErrors.validationError({
                    message: 'Phone number already exists'
                });
            }
        }

        // 生成用户ID和令牌
        const userId = generateId(32);
        const userToken = generateId(32);
        const username = generateId(16).toLowerCase();
        const finalDisplayUsername = displayUsername || generateId(16).toLowerCase();

        // 创建用户记录
        const [newUser] = await db.insert(UserTable).values({
            id: userId,
            name,
            email,
            username,
            displayUsername: finalDisplayUsername,
            phoneNumber,
            emailVerified,
            phoneNumberVerified,
            role,
            token: userToken,
            up: trafficLimit.up,
            down: trafficLimit.down,
            total: trafficLimit.total,
            remaining: trafficLimit.remaining,
            deviceLimit,
            speedLimit,
            inviteBy,
        }).returning();

        // 如果提供了密码，创建账户记录
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const accountId = generateId(32);
            const providerId = generateId(32);

            await db.insert(AccountTable).values({
                id: accountId,
                accountId: userId,
                providerId: providerId,
                userId: userId,
                password: hashedPassword,
            });
        }

        logger.info(`用户创建成功: ${email} (${userId})`);

        return {
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                displayUsername: newUser.displayUsername,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                emailVerified: newUser.emailVerified,
                phoneNumberVerified: newUser.phoneNumberVerified,
                token: newUser.token,
                traffic: {
                    up: newUser.up,
                    down: newUser.down,
                    total: newUser.total,
                    remaining: newUser.remaining,
                },
                deviceLimit: newUser.deviceLimit,
                speedLimit: newUser.speedLimit,
                createdAt: newUser.createdAt,
            },
        };
    }

    /**
     * 获取用户信息
     */
    async getUserById(userId: string) {
        if (!userId) {
            throw RpcErrors.invalidParams({
                message: 'User ID is required'
            });
        }

        const [user] = await db.select()
            .from(UserTable)
            .where(eq(UserTable.id, userId))
            .limit(1);

        if (!user) {
            throw RpcErrors.validationError({
                message: 'User not found'
            });
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            displayUsername: user.displayUsername,
            phoneNumber: user.phoneNumber,
            role: user.role,
            emailVerified: user.emailVerified,
            phoneNumberVerified: user.phoneNumberVerified,
            image: user.image,
            banned: user.banned,
            banReason: user.banReason,
            banExpires: user.banExpires,
            token: user.token,
            traffic: {
                up: user.up,
                down: user.down,
                total: user.total,
                remaining: user.remaining,
            },
            deviceLimit: user.deviceLimit,
            speedLimit: user.speedLimit,
            currentTrafficPackageId: user.currentTrafficPackageId,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    /**
     * 根据邮箱获取用户
     */
    async getUserByEmail(email: string) {
        if (!email) {
            throw RpcErrors.invalidParams({
                message: 'Email is required'
            });
        }

        const [user] = await db.select()
            .from(UserTable)
            .where(eq(UserTable.email, email))
            .limit(1);

        if (!user) {
            throw RpcErrors.validationError({
                message: 'User not found'
            });
        }

        return this.getUserById(user.id);
    }

    /**
     * 更新用户信息
     */
    async updateUser(userId: string, updates: {
        name?: string;
        email?: string;
        phoneNumber?: string;
        displayUsername?: string;
        role?: UserRole;
        emailVerified?: boolean;
        phoneNumberVerified?: boolean;
        banned?: boolean;
        banReason?: string;
        banExpires?: Date;
        traffic?: {
            up?: number;
            down?: number;
            total?: number;
            remaining?: number;
        };
        deviceLimit?: number;
        speedLimit?: number;
        currentTrafficPackageId?: string;
    }) {
        if (!userId) {
            throw RpcErrors.invalidParams({
                message: 'User ID is required'
            });
        }

        // 检查用户是否存在
        const existingUser = await db.select({ id: UserTable.id })
            .from(UserTable)
            .where(eq(UserTable.id, userId))
            .limit(1);

        if (existingUser.length === 0) {
            throw RpcErrors.validationError({
                message: 'User not found'
            });
        }

        // 构建更新数据
        const updateData: any = {};
        
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.email !== undefined) updateData.email = updates.email;
        if (updates.phoneNumber !== undefined) updateData.phoneNumber = updates.phoneNumber;
        if (updates.displayUsername !== undefined) updateData.displayUsername = updates.displayUsername;
        if (updates.role !== undefined) updateData.role = updates.role;
        if (updates.emailVerified !== undefined) updateData.emailVerified = updates.emailVerified;
        if (updates.phoneNumberVerified !== undefined) updateData.phoneNumberVerified = updates.phoneNumberVerified;
        if (updates.banned !== undefined) updateData.banned = updates.banned;
        if (updates.banReason !== undefined) updateData.banReason = updates.banReason;
        if (updates.banExpires !== undefined) updateData.banExpires = updates.banExpires;
        if (updates.deviceLimit !== undefined) updateData.deviceLimit = updates.deviceLimit;
        if (updates.speedLimit !== undefined) updateData.speedLimit = updates.speedLimit;
        if (updates.currentTrafficPackageId !== undefined) updateData.currentTrafficPackageId = updates.currentTrafficPackageId;

        // 更新流量信息
        if (updates.traffic) {
            if (updates.traffic.up !== undefined) updateData.up = updates.traffic.up;
            if (updates.traffic.down !== undefined) updateData.down = updates.traffic.down;
            if (updates.traffic.total !== undefined) updateData.total = updates.traffic.total;
            if (updates.traffic.remaining !== undefined) updateData.remaining = updates.traffic.remaining;
        }

        // 执行更新
        const [updatedUser] = await db.update(UserTable)
            .set(updateData)
            .where(eq(UserTable.id, userId))
            .returning();

        logger.info(`用户信息更新成功: ${userId}`);

        return {
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                username: updatedUser.username,
                displayUsername: updatedUser.displayUsername,
                phoneNumber: updatedUser.phoneNumber,
                role: updatedUser.role,
                emailVerified: updatedUser.emailVerified,
                phoneNumberVerified: updatedUser.phoneNumberVerified,
                token: updatedUser.token,
                traffic: {
                    up: updatedUser.up,
                    down: updatedUser.down,
                    total: updatedUser.total,
                    remaining: updatedUser.remaining,
                },
                deviceLimit: updatedUser.deviceLimit,
                speedLimit: updatedUser.speedLimit,
                currentTrafficPackageId: updatedUser.currentTrafficPackageId,
                updatedAt: updatedUser.updatedAt,
            },
        };
    }

    /**
     * 删除用户
     */
    async deleteUser(userId: string) {
        if (!userId) {
            throw RpcErrors.invalidParams({
                message: 'User ID is required'
            });
        }

        // 检查用户是否存在
        const existingUser = await db.select({ id: UserTable.id })
            .from(UserTable)
            .where(eq(UserTable.id, userId))
            .limit(1);

        if (existingUser.length === 0) {
            throw RpcErrors.validationError({
                message: 'User not found'
            });
        }

        // 删除相关账户记录
        await db.delete(AccountTable)
            .where(eq(AccountTable.userId, userId));

        // 删除用户记录
        await db.delete(UserTable)
            .where(eq(UserTable.id, userId));

        logger.info(`用户删除成功: ${userId}`);

        return {
            success: true,
            message: 'User deleted successfully',
        };
    }

    /**
     * 获取用户列表
     */
    async getUserList(params: {
        page?: number;
        limit?: number;
        role?: UserRole;
        emailVerified?: boolean;
        banned?: boolean;
        search?: string;
    }) {
        const {
            page = 1,
            limit = 20,
            role,
            emailVerified,
            banned,
            search
        } = params;

        const offset = (page - 1) * limit;

        // 构建查询条件
        let whereConditions: any[] = [];
        
        if (role) {
            whereConditions.push(eq(UserTable.role, role));
        }
        
        if (emailVerified !== undefined) {
            whereConditions.push(eq(UserTable.emailVerified, emailVerified));
        }
        
        if (banned !== undefined) {
            whereConditions.push(eq(UserTable.banned, banned));
        }
        
        if (search) {
            whereConditions.push(
                and(
                    UserTable.email.like(`%${search}%`)
                )
            );
        }

        // 获取总数
        const countQuery = db.select({ count: UserTable.id })
            .from(UserTable);
            
        if (whereConditions.length > 0) {
            countQuery.where(and(...whereConditions));
        }

        const [{ count: totalCount }] = await countQuery;

        // 获取用户列表
        const usersQuery = db.select()
            .from(UserTable)
            .limit(limit)
            .offset(offset);
            
        if (whereConditions.length > 0) {
            usersQuery.where(and(...whereConditions));
        }

        const users = await usersQuery;

        return {
            success: true,
            users: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                displayUsername: user.displayUsername,
                phoneNumber: user.phoneNumber,
                role: user.role,
                emailVerified: user.emailVerified,
                phoneNumberVerified: user.phoneNumberVerified,
                banned: user.banned,
                token: user.token,
                traffic: {
                    up: user.up,
                    down: user.down,
                    total: user.total,
                    remaining: user.remaining,
                },
                deviceLimit: user.deviceLimit,
                speedLimit: user.speedLimit,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            })),
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    /**
     * 重置用户密码
     */
    async resetPassword(userId: string, newPassword: string) {
        if (!userId || !newPassword) {
            throw RpcErrors.invalidParams({
                message: 'User ID and new password are required'
            });
        }

        // 检查用户是否存在
        const existingUser = await db.select({ id: UserTable.id })
            .from(UserTable)
            .where(eq(UserTable.id, userId))
            .limit(1);

        if (existingUser.length === 0) {
            throw RpcErrors.validationError({
                message: 'User not found'
            });
        }

        // 加密新密码
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 更新账户记录
        const [updatedAccount] = await db.update(AccountTable)
            .set({ password: hashedPassword })
            .where(eq(AccountTable.userId, userId))
            .returning();

        if (!updatedAccount) {
            // 如果没有账户记录，创建一个
            const accountId = generateId(32);
            const providerId = generateId(32);

            await db.insert(AccountTable).values({
                id: accountId,
                accountId: userId,
                providerId: providerId,
                userId: userId,
                password: hashedPassword,
            });
        }

        logger.info(`用户密码重置成功: ${userId}`);

        return {
            success: true,
            message: 'Password reset successfully',
        };
    }
}

// 导出单例
export const userService = new UserService();