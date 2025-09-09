import { db } from "@/db";
import {  UserTable } from "@/db/schemas/auth";
import { eq, or } from "drizzle-orm";

export class UserService {
    static async findById(id: string) {
        return await db.query.UserTable.findFirst({
            where: eq(UserTable.id, id),
        })
    }

}