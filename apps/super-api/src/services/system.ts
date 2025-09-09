import { db } from "@/db";
import { SettingTable } from "@/db/schemas/system";
import { eq } from "drizzle-orm";

export class SystemSettingService {
    static async getAllSettings() {
        const settings = await db.query.SettingTable.findMany();
        return settings.map((item) => ({
            key: item.key,
            value: item.value,
            remark: item.remark,
        }));
    }
    static async getSetting(key: string) {
        const setting = await db.query.SettingTable.findFirst({
            where: (t, { eq }) => eq(t.key, key),
        })
        return setting?.value
    }
    static async setSetting(key: string, value: string) {
        const existing = await db.query.SettingTable.findFirst({
            where: (t, { eq }) => eq(t.key, key),
        })
        if (existing) {
            return await db.update(SettingTable).set({
                value,
            }).where(eq(SettingTable.key, key)).returning({
                value: SettingTable.value,
            });
        } else {
            await db.insert(SettingTable).values({
                key,
                value,
            })
            return true;
        }
    }
    static async updateSetting(key: string, value: string) {
        const existing = await db.query.SettingTable.findFirst({
            where: (t, { eq }) => eq(t.key, key),
        })
        if (!existing) {
            throw new Error("Setting not found");
        }
        if (existing.value === value) {
            return value;
        }
        await db.update(SettingTable).set({
            value,
        }).where(eq(SettingTable.key, key));
        return value;
    }
    static async deleteSetting(key: string) {
        await db.delete(SettingTable).where(eq(SettingTable.key, key)).returning();
        return true;
    }
}