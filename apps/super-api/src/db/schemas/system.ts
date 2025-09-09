import * as p from "drizzle-orm/pg-core";

import { baseFields } from "./common";

// 设置表
export const SettingTable = p.pgTable("settings", {
    ...baseFields,
    /** 设置键 */
    key: p.varchar("key", { length: 255 }).notNull(),
    /** 设置值 */
    value: p.text("value"),
    /** 备注 */
    remark: p.text("remark"),
},(t) => [
    p.index("system_setting_key_idx").on(t.key),
]);
