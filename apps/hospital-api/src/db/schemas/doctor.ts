import * as p from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { StatusEnum, type Status } from "./enums";
import { relations } from "drizzle-orm";
import { HospitalTable, DepartmentTable, DistrictTable } from "./hospital";

/**
 * 医生表
 * 存储医生基本信息
 */
export const DoctorTable = p.pgTable("doctors", {
    /** 医生唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 工作医院 */
    workHospital: p.varchar("work_hospital", { length: 255 }),
    /** 医生姓名 */
    name: p.varchar("name", { length: 255 }).notNull(),
    /** 职级 */
    rank: p.varchar("rank", { length: 50 }),
    /** 职称 */
    title: p.varchar("title", { length: 50 }),
    /** 手机号 */
    phone: p.varchar("phone", { length: 20 }).notNull(),
    /** 头像 */
    avatar: p.varchar("avatar", { length: 255 }),
    /** 简介 */
    introduction: p.text("introduction"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 短信验证码 */
    verificationCode: p.varchar("verification_code", { length: 6 }),
    /** 验证码是否已使用 */
    verificationCodeUsed: p.boolean("verification_code_used").default(false).notNull(),
    /** 当日短信发送次数 */
    dailySmsCount: p.integer("daily_sms_count").default(0).notNull(),
    /** 最后发送短信时间 */
    lastSmsSentAt: p.timestamp("last_sms_sent_at"),
    /** 是否外院专家 */
    isExternalExpert: p.boolean("is_external_expert").default(false).notNull(),
    /** 是否开启专家门诊 */
    enableExpertClinic: p.boolean("enable_expert_clinic").default(false).notNull(),
    /** 是否开启特殊门诊 */
    enableSpecialClinic: p.boolean("enable_special_clinic").default(false).notNull(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("doctor_hospital_id_idx").on(t.hospitalId),
    p.index("doctor_status_idx").on(t.status),
]);

/**
 * 医生科室关联表
 * 多对多关系：医生可以属于多个科室
 */
export const DoctorDepartmentTable = p.pgTable("doctor_department", {
    /** 关联唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医生ID */
    doctorId: p.bigint("doctor_id", { mode: "bigint" }).notNull(),
    /** 科室ID */
    departmentId: p.bigint("department_id", { mode: "bigint" }).notNull(),
    ...timestamps,
}, (t) => [
    p.index("doctor_department_doctor_id_idx").on(t.doctorId),
    p.index("doctor_department_department_id_idx").on(t.departmentId),
    p.unique("doctor_department_unique").on(t.doctorId, t.departmentId),
]);

/**
 * 医生院区关联表
 * 多对多关系：医生可以在多个院区工作
 */
export const DoctorDistrictTable = p.pgTable("doctor_district", {
    /** 关联唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医生ID */
    doctorId: p.bigint("doctor_id", { mode: "bigint" }).notNull(),
    /** 院区ID */
    districtId: p.bigint("district_id", { mode: "bigint" }).notNull(),
    ...timestamps,
}, (t) => [
    p.index("doctor_district_doctor_id_idx").on(t.doctorId),
    p.index("doctor_district_district_id_idx").on(t.districtId),
    p.unique("doctor_district_unique").on(t.doctorId, t.districtId),
]);

/**
 * 特殊门诊表
 * 存储特殊门诊信息
 */
export const SpecialClinicTable = p.pgTable("special_clinics", {
    /** 特殊门诊唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 特殊门诊名称 */
    name: p.varchar("name", { length: 255 }).notNull(),
    /** 特殊门诊描述 */
    description: p.text("description"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("special_clinic_hospital_id_idx").on(t.hospitalId),
    p.index("special_clinic_status_idx").on(t.status),
]);

/**
 * 医生特殊门诊关联表
 * 多对多关系：医生可以参与多个特殊门诊
 */
export const DoctorSpecialClinicTable = p.pgTable("doctor_special_clinic", {
    /** 关联唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医生ID */
    doctorId: p.bigint("doctor_id", { mode: "bigint" }).notNull(),
    /** 特殊门诊ID */
    specialClinicId: p.bigint("special_clinic_id", { mode: "bigint" }).notNull(),
    ...timestamps,
}, (t) => [
    p.index("doctor_special_clinic_doctor_id_idx").on(t.doctorId),
    p.index("doctor_special_clinic_special_clinic_id_idx").on(t.specialClinicId),
    p.unique("doctor_special_clinic_unique").on(t.doctorId, t.specialClinicId),
]);

// 关系定义
export const doctorRelations = relations(DoctorTable, ({ one, many }) => ({
    hospital: one(HospitalTable, {
        fields: [DoctorTable.hospitalId],
        references: [HospitalTable.id],
    }),
    doctorDepartments: many(DoctorDepartmentTable),
    doctorDistricts: many(DoctorDistrictTable),
    doctorSpecialClinics: many(DoctorSpecialClinicTable),
}));

export const doctorDepartmentRelations = relations(DoctorDepartmentTable, ({ one }) => ({
    doctor: one(DoctorTable, {
        fields: [DoctorDepartmentTable.doctorId],
        references: [DoctorTable.id],
    }),
    department: one(DepartmentTable, {
        fields: [DoctorDepartmentTable.departmentId],
        references: [DepartmentTable.id],
    }),
}));

export const doctorDistrictRelations = relations(DoctorDistrictTable, ({ one }) => ({
    doctor: one(DoctorTable, {
        fields: [DoctorDistrictTable.doctorId],
        references: [DoctorTable.id],
    }),
    district: one(DistrictTable, {
        fields: [DoctorDistrictTable.districtId],
        references: [DistrictTable.id],
    }),
}));

export const specialClinicRelations = relations(SpecialClinicTable, ({ one, many }) => ({
    hospital: one(HospitalTable, {
        fields: [SpecialClinicTable.hospitalId],
        references: [HospitalTable.id],
    }),
    doctorSpecialClinics: many(DoctorSpecialClinicTable),
}));

export const doctorSpecialClinicRelations = relations(DoctorSpecialClinicTable, ({ one }) => ({
    doctor: one(DoctorTable, {
        fields: [DoctorSpecialClinicTable.doctorId],
        references: [DoctorTable.id],
    }),
    specialClinic: one(SpecialClinicTable, {
        fields: [DoctorSpecialClinicTable.specialClinicId],
        references: [SpecialClinicTable.id],
    }),
}));