import * as p from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { StatusEnum, type Status } from "./enums";
import { relations } from "drizzle-orm";

/**
 * 医院表
 * 存储医院基本信息、配置等
 */
export const HospitalTable = p.pgTable("hospitals", {
    /** 医院唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 用户ID */
    userId: p.bigint("user_id", { mode: "bigint" }),
    /** 医院编码 */
    code: p.varchar("code", { length: 255 }).unique(),
    /** 医院名称 */
    name: p.varchar("name", { length: 255 }).notNull(),
    /** 医院简介 */
    description: p.text("description"),
    /** 医院域名 */
    domain: p.varchar("domain", { length: 255 }).unique(),
    /** 医院图标 */
    icon: p.varchar("icon", { length: 255 }),
    /** 医院封面 */
    cover: p.varchar("cover", { length: 255 }),
    /** 联系方式 */
    contact: p.varchar("contact", { length: 255 }),
    /** 医院地址 */
    address: p.text("address"),
    /** 隐私政策 */
    privacyPolicy: p.text("privacy_policy"),
    /** 用户协议 */
    userAgreement: p.text("user_agreement"),
    /** 医院状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 医生端小程序AppID */
    doctorMiniProgramAppid: p.varchar("doctor_mini_program_appid", { length: 255 }),
    /** 医生端小程序AppSecret */
    doctorMiniProgramSecret: p.varchar("doctor_mini_program_secret", { length: 255 }),
    /** 会员端小程序AppID */
    memberMiniProgramAppid: p.varchar("member_mini_program_appid", { length: 255 }),
    /** 会员端小程序AppSecret */
    memberMiniProgramSecret: p.varchar("member_mini_program_secret", { length: 255 }),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("idx_user_id").on(t.userId),
]);

/**
 * 操作日志表
 * 记录系统操作日志
 */
export const ActionLogTable = p.pgTable("action_logs", {
    /** 日志唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 用户ID */
    userId: p.bigint("user_id", { mode: "bigint" }).notNull(),
    /** 操作类型 */
    type: p.varchar("type", { length: 255 }).notNull(),
    /** 操作标题 */
    title: p.varchar("title", { length: 255 }).notNull(),
    /** 操作内容 */
    content: p.varchar("content", { length: 255 }),
    ...timestamps,
}, (t) => [
    p.index("hospital_id_idx").on(t.hospitalId),
    p.index("user_idx").on(t.userId),
    p.index("type_idx").on(t.type),
]);

/**
 * 院区表
 * 存储医院下属院区信息
 */
export const DistrictTable = p.pgTable("districts", {
    /** 院区唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 院区名称 */
    name: p.varchar("name", { length: 255 }).notNull(),
    /** 备注 */
    remark: p.varchar("remark", { length: 255 }),
    /** 地址 */
    address: p.varchar("address", { length: 255 }),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("district_hospital_id_idx").on(t.hospitalId),
    p.index("district_status_idx").on(t.status),
]);

/**
 * 科室表
 * 存储医院科室信息
 */
export const DepartmentTable = p.pgTable("departments", {
    /** 科室唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 科室名称 */
    name: p.varchar("name", { length: 255 }).notNull(),
    /** 备注 */
    remark: p.varchar("remark", { length: 255 }),
    /** 头像 */
    avatar: p.varchar("avatar", { length: 255 }),
    /** 科室描述 */
    description: p.text("description"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("department_hospital_id_idx").on(t.hospitalId),
    p.index("department_status_idx").on(t.status),
]);

// 关系定义
export const hospitalRelations = relations(HospitalTable, ({ many }) => ({
    actionLogs: many(ActionLogTable),
    districts: many(DistrictTable),
    departments: many(DepartmentTable),
}));

export const actionLogRelations = relations(ActionLogTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [ActionLogTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));

export const districtRelations = relations(DistrictTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [DistrictTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));

export const departmentRelations = relations(DepartmentTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [DepartmentTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));