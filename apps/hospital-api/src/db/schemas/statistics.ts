import * as p from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { StatusEnum, type Status } from "./enums";
import { relations } from "drizzle-orm";
import { HospitalTable } from "./hospital";

/**
 * 医院日统计表
 * 存储医院每日的统计数据
 */
export const HospitalDailyStatisticTable = p.pgTable("hospital_daily_statistics", {
    /** 统计唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 统计日期 */
    statisticDate: p.date("statistic_date").notNull(),
    /** 普通门诊预约数 */
    generalClinicAppointments: p.integer("general_clinic_appointments").default(0),
    /** 专家门诊预约数 */
    expertClinicAppointments: p.integer("expert_clinic_appointments").default(0),
    /** 特殊门诊预约数 */
    specialClinicAppointments: p.integer("special_clinic_appointments").default(0),
    /** 总预约数 */
    totalAppointments: p.integer("total_appointments").default(0),
    /** 已完成预约数 */
    completedAppointments: p.integer("completed_appointments").default(0),
    /** 已取消预约数 */
    cancelledAppointments: p.integer("cancelled_appointments").default(0),
    /** 新增患者数 */
    newPatients: p.integer("new_patients").default(0),
    /** 活跃患者数 */
    activePatients: p.integer("active_patients").default(0),
    /** 发送短信数 */
    sentSms: p.integer("sent_sms").default(0),
    /** 短信发送成功数 */
    successfulSms: p.integer("successful_sms").default(0),
    /** 短信发送失败数 */
    failedSms: p.integer("failed_sms").default(0),
    /** 页面浏览量 */
    pageViews: p.integer("page_views").default(0),
    /** 独立访客数 */
    uniqueVisitors: p.integer("unique_visitors").default(0),
    /** 备注 */
    remark: p.text("remark"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("hospital_daily_statistic_hospital_id_idx").on(t.hospitalId),
    p.index("hospital_daily_statistic_date_idx").on(t.statisticDate),
    p.unique("hospital_daily_statistic_unique").on(t.hospitalId, t.statisticDate),
]);

/**
 * 医院总统计表
 * 存储医院的累计统计数据
 */
export const HospitalTotalStatisticTable = p.pgTable("hospital_total_statistics", {
    /** 统计唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull().unique(),
    /** 总预约数 */
    totalAppointments: p.bigint("total_appointments", { mode: "bigint" }).notNull(),
    /** 总完成预约数 */
    totalCompletedAppointments: p.bigint("total_completed_appointments", { mode: "bigint" }).notNull(),
    /** 总取消预约数 */
    totalCancelledAppointments: p.bigint("total_cancelled_appointments", { mode: "bigint" }).notNull(),
    /** 总患者数 */
    totalPatients: p.bigint("total_patients", { mode: "bigint" }).notNull(),
    /** 总发送短信数 */
    totalSentSms: p.bigint("total_sent_sms", { mode: "bigint" }).notNull(),
    /** 总短信发送成功数 */
    totalSuccessfulSms: p.bigint("total_successful_sms", { mode: "bigint" }).notNull(),
    /** 总短信发送失败数 */
    totalFailedSms: p.bigint("total_failed_sms", { mode: "bigint" }).notNull(),
    /** 总页面浏览量 */
    totalPageViews: p.bigint("total_page_views", { mode: "bigint" }).notNull(),
    /** 总独立访客数 */
    totalUniqueVisitors: p.bigint("total_unique_visitors", { mode: "bigint" }).notNull(),
    /** 普通门诊总预约数 */
    totalGeneralClinicAppointments: p.bigint("total_general_clinic_appointments", { mode: "bigint" }).notNull(),
    /** 专家门诊总预约数 */
    totalExpertClinicAppointments: p.bigint("total_expert_clinic_appointments", { mode: "bigint" }).notNull(),
    /** 特殊门诊总预约数 */
    totalSpecialClinicAppointments: p.bigint("total_special_clinic_appointments", { mode: "bigint" }).notNull(),
    /** 最后更新时间 */
    lastUpdatedAt: p.timestamp("last_updated_at"),
    /** 备注 */
    remark: p.text("remark"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.unique("hospital_total_statistic_hospital_id_unique").on(t.hospitalId),
]);

// 关系定义
export const hospitalDailyStatisticRelations = relations(HospitalDailyStatisticTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [HospitalDailyStatisticTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));

export const hospitalTotalStatisticRelations = relations(HospitalTotalStatisticTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [HospitalTotalStatisticTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));