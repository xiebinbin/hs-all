import * as p from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { StatusEnum, type Status, type Gender } from "./enums";
import { relations } from "drizzle-orm";
import { HospitalTable } from "./hospital";

/**
 * 患者表
 * 存储患者基本信息
 */
export const PatientTable = p.pgTable("patients", {
    /** 患者唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 患者姓名 */
    name: p.varchar("name", { length: 100 }).notNull(),
    /** 患者手机号 */
    phone: p.varchar("phone", { length: 20 }).notNull(),
    /** 患者身份证号 */
    idCard: p.varchar("id_card", { length: 20 }),
    /** 性别 */
    gender: p.varchar("gender", { length: 10 }).$type<Gender>(),
    /** 出生日期 */
    birthDate: p.date("birth_date"),
    /** 年龄 */
    age: p.integer("age"),
    /** 地址 */
    address: p.text("address"),
    /** 紧急联系人 */
    emergencyContact: p.varchar("emergency_contact", { length: 100 }),
    /** 紧急联系人电话 */
    emergencyPhone: p.varchar("emergency_phone", { length: 20 }),
    /** 过敏史 */
    allergies: p.text("allergies"),
    /** 病史 */
    medicalHistory: p.text("medical_history"),
    /** 备注 */
    remark: p.text("remark"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("patient_hospital_id_idx").on(t.hospitalId),
    p.index("patient_phone_idx").on(t.phone),
    p.index("patient_id_card_idx").on(t.idCard),
    p.index("patient_name_idx").on(t.name),
    p.index("patient_status_idx").on(t.status),
]);

/**
 * 轮播图表
 * 存储首页轮播图信息
 */
export const CarouselTable = p.pgTable("carousels", {
    /** 轮播图唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 标题 */
    title: p.varchar("title", { length: 255 }).notNull(),
    /** 描述 */
    description: p.text("description"),
    /** 图片URL */
    imageUrl: p.varchar("image_url", { length: 500 }),
    /** 链接URL */
    linkUrl: p.varchar("link_url", { length: 500 }),
    /** 排序 */
    sort: p.integer("sort").default(0),
    /** 是否显示 */
    isVisible: p.boolean("is_visible").default(true),
    /** 开始时间 */
    startTime: p.timestamp("start_time"),
    /** 结束时间 */
    endTime: p.timestamp("end_time"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("carousel_hospital_id_idx").on(t.hospitalId),
    p.index("carousel_sort_idx").on(t.sort),
    p.index("carousel_is_visible_idx").on(t.isVisible),
    p.index("carousel_status_idx").on(t.status),
]);

/**
 * 公告表
 * 存储医院公告信息
 */
export const AnnouncementTable = p.pgTable("announcements", {
    /** 公告唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 标题 */
    title: p.varchar("title", { length: 255 }).notNull(),
    /** 内容 */
    content: p.text("content"),
    /** 摘要 */
    summary: p.text("summary"),
    /** 作者 */
    author: p.varchar("author", { length: 100 }),
    /** 排序 */
    sort: p.integer("sort").default(0),
    /** 是否置顶 */
    isTop: p.boolean("is_top").default(false),
    /** 是否显示 */
    isVisible: p.boolean("is_visible").default(true),
    /** 发布时间 */
    publishedAt: p.timestamp("published_at"),
    /** 浏览次数 */
    viewCount: p.integer("view_count").default(0),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("announcement_hospital_id_idx").on(t.hospitalId),
    p.index("announcement_sort_idx").on(t.sort),
    p.index("announcement_is_top_idx").on(t.isTop),
    p.index("announcement_is_visible_idx").on(t.isVisible),
    p.index("announcement_published_at_idx").on(t.publishedAt),
    p.index("announcement_status_idx").on(t.status),
]);

// 关系定义
export const patientRelations = relations(PatientTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [PatientTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));

export const carouselRelations = relations(CarouselTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [CarouselTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));

export const announcementRelations = relations(AnnouncementTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [AnnouncementTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));