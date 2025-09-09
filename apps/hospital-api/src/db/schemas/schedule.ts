import * as p from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { StatusEnum, ClinicScheduleGroupEnum, ClinicScheduleStatusEnum, type Status, type ClinicScheduleGroup, type ClinicScheduleStatus } from "./enums";
import { relations } from "drizzle-orm";
import { HospitalTable, DistrictTable, DepartmentTable } from "./hospital";
import { DoctorTable, SpecialClinicTable } from "./doctor";

/**
 * 普通门诊排班表
 * 存储普通门诊的排班信息
 */
export const GeneralClinicScheduleTable = p.pgTable("general_clinic_schedules", {
    /** 排班唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 院区ID */
    districtId: p.bigint("district_id", { mode: "bigint" }).notNull(),
    /** 科室ID */
    departmentId: p.bigint("department_id", { mode: "bigint" }).notNull(),
    /** 排班日期 */
    date: p.date("date"),
    /** 时间段分组 */
    tableGroup: p.varchar("table_group", { length: 255 }),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("general_clinic_schedule_hospital_id_idx").on(t.hospitalId),
    p.index("general_clinic_schedule_district_id_idx").on(t.districtId),
    p.index("general_clinic_schedule_department_id_idx").on(t.departmentId),
    p.index("general_clinic_schedule_status_idx").on(t.status),
    p.index().on(t.tableGroup),
]);

/**
 * 普通门诊排班详情表
 * 存储普通门诊排班的具体时间段信息
 */
export const GeneralClinicScheduleDetailTable = p.pgTable("general_clinic_schedule_details", {
    /** 详情唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 普通门诊排班ID */
    generalClinicScheduleId: p.bigint("general_clinic_schedule_id", { mode: "bigint" }).notNull(),
    /** 时段（上午/下午） */
    group: p.varchar("group", { length: 20 }).notNull().default(ClinicScheduleGroupEnum.MORNING).$type<ClinicScheduleGroup>(),
    /** 时间段 */
    timeSlot: p.varchar("time_slot", { length: 50 }),
    /** 排序 */
    sort: p.integer("sort").default(10),
    /** 库存 */
    stock: p.integer("stock").default(0),
    /** 销售量 */
    sales: p.integer("sales").default(0),
    /** 备注 */
    remark: p.varchar("remark", { length: 255 }),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(ClinicScheduleStatusEnum.NORMAL).$type<ClinicScheduleStatus>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("general_clinic_schedule_detail_hospital_id_idx").on(t.hospitalId),
    p.index("general_clinic_schedule_detail_general_clinic_schedule_id_idx").on(t.generalClinicScheduleId),
]);

/**
 * 专家门诊排班表
 * 存储专家门诊的排班信息
 */
export const ExpertClinicScheduleTable = p.pgTable("expert_clinic_schedules", {
    /** 排班唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 院区ID */
    districtId: p.bigint("district_id", { mode: "bigint" }).notNull(),
    /** 医生ID */
    doctorId: p.bigint("doctor_id", { mode: "bigint" }).notNull(),
    /** 排班日期 */
    date: p.timestamp("date"),
    /** 时间段分组 */
    tableGroup: p.varchar("table_group", { length: 255 }),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("expert_clinic_schedule_hospital_id_idx").on(t.hospitalId),
    p.index("expert_clinic_schedule_district_id_idx").on(t.districtId),
    p.index("expert_clinic_schedule_doctor_id_idx").on(t.doctorId),
    p.index("expert_clinic_schedule_status_idx").on(t.status),
    p.index().on(t.tableGroup),
]);

/**
 * 专家门诊排班详情表
 * 存储专家门诊排班的具体时间段信息
 */
export const ExpertClinicScheduleDetailTable = p.pgTable("expert_clinic_schedule_details", {
    /** 详情唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 专家门诊排班ID */
    expertClinicScheduleId: p.bigint("expert_clinic_schedule_id", { mode: "bigint" }).notNull(),
    /** 时段（上午/下午） */
    group: p.varchar("group", { length: 20 }).notNull().default(ClinicScheduleGroupEnum.MORNING).$type<ClinicScheduleGroup>(),
    /** 时间段 */
    timeSlot: p.varchar("time_slot", { length: 50 }),
    /** 排序 */
    sort: p.integer("sort").default(10),
    /** 库存 */
    stock: p.integer("stock").default(0),
    /** 销售量 */
    sales: p.integer("sales").default(0),
    /** 备注 */
    remark: p.varchar("remark", { length: 255 }),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(ClinicScheduleStatusEnum.NORMAL).$type<ClinicScheduleStatus>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("expert_clinic_schedule_detail_hospital_id_idx").on(t.hospitalId),
    p.index("expert_clinic_schedule_detail_expert_clinic_schedule_id_idx").on(t.expertClinicScheduleId),
]);

/**
 * 特殊门诊排班表
 * 存储特殊门诊的排班信息
 */
export const SpecialClinicScheduleTable = p.pgTable("special_clinic_schedules", {
    /** 排班唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 院区ID */
    districtId: p.bigint("district_id", { mode: "bigint" }).notNull(),
    /** 特殊门诊ID */
    specialClinicId: p.bigint("special_clinic_id", { mode: "bigint" }).notNull(),
    /** 医生ID */
    doctorId: p.bigint("doctor_id", { mode: "bigint" }).notNull(),
    /** 排班日期 */
    date: p.timestamp("date"),
    /** 时间段分组 */
    tableGroup: p.varchar("table_group", { length: 255 }),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("special_clinic_schedule_hospital_id_idx").on(t.hospitalId),
    p.index("special_clinic_schedule_district_id_idx").on(t.districtId),
    p.index("special_clinic_schedule_special_clinic_id_idx").on(t.specialClinicId),
    p.index("special_clinic_schedule_doctor_id_idx").on(t.doctorId),
    p.index("special_clinic_schedule_status_idx").on(t.status),
    p.index().on(t.tableGroup),
]);

/**
 * 特殊门诊排班详情表
 * 存储特殊门诊排班的具体时间段信息
 */
export const SpecialClinicScheduleDetailTable = p.pgTable("special_clinic_schedule_details", {
    /** 详情唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 特殊门诊排班ID */
    specialClinicScheduleId: p.bigint("special_clinic_schedule_id", { mode: "bigint" }).notNull(),
    /** 时段（上午/下午） */
    group: p.varchar("group", { length: 20 }).notNull().default(ClinicScheduleGroupEnum.MORNING).$type<ClinicScheduleGroup>(),
    /** 时间段 */
    timeSlot: p.varchar("time_slot", { length: 50 }),
    /** 排序 */
    sort: p.integer("sort").default(10),
    /** 库存 */
    stock: p.integer("stock").default(0),
    /** 销售量 */
    sales: p.integer("sales").default(0),
    /** 备注 */
    remark: p.varchar("remark", { length: 255 }),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(ClinicScheduleStatusEnum.NORMAL).$type<ClinicScheduleStatus>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("special_clinic_schedule_detail_hospital_id_idx").on(t.hospitalId),
    p.index("special_clinic_schedule_detail_special_clinic_schedule_id_idx").on(t.specialClinicScheduleId),
]);

// 关系定义
export const generalClinicScheduleRelations = relations(GeneralClinicScheduleTable, ({ one, many }) => ({
    hospital: one(HospitalTable, {
        fields: [GeneralClinicScheduleTable.hospitalId],
        references: [HospitalTable.id],
    }),
    district: one(DistrictTable, {
        fields: [GeneralClinicScheduleTable.districtId],
        references: [DistrictTable.id],
    }),
    department: one(DepartmentTable, {
        fields: [GeneralClinicScheduleTable.departmentId],
        references: [DepartmentTable.id],
    }),
    details: many(GeneralClinicScheduleDetailTable),
}));

export const generalClinicScheduleDetailRelations = relations(GeneralClinicScheduleDetailTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [GeneralClinicScheduleDetailTable.hospitalId],
        references: [HospitalTable.id],
    }),
    schedule: one(GeneralClinicScheduleTable, {
        fields: [GeneralClinicScheduleDetailTable.generalClinicScheduleId],
        references: [GeneralClinicScheduleTable.id],
    }),
}));

export const expertClinicScheduleRelations = relations(ExpertClinicScheduleTable, ({ one, many }) => ({
    hospital: one(HospitalTable, {
        fields: [ExpertClinicScheduleTable.hospitalId],
        references: [HospitalTable.id],
    }),
    district: one(DistrictTable, {
        fields: [ExpertClinicScheduleTable.districtId],
        references: [DistrictTable.id],
    }),
    doctor: one(DoctorTable, {
        fields: [ExpertClinicScheduleTable.doctorId],
        references: [DoctorTable.id],
    }),
    details: many(ExpertClinicScheduleDetailTable),
}));

export const expertClinicScheduleDetailRelations = relations(ExpertClinicScheduleDetailTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [ExpertClinicScheduleDetailTable.hospitalId],
        references: [HospitalTable.id],
    }),
    schedule: one(ExpertClinicScheduleTable, {
        fields: [ExpertClinicScheduleDetailTable.expertClinicScheduleId],
        references: [ExpertClinicScheduleTable.id],
    }),
}));

export const specialClinicScheduleRelations = relations(SpecialClinicScheduleTable, ({ one, many }) => ({
    hospital: one(HospitalTable, {
        fields: [SpecialClinicScheduleTable.hospitalId],
        references: [HospitalTable.id],
    }),
    district: one(DistrictTable, {
        fields: [SpecialClinicScheduleTable.districtId],
        references: [DistrictTable.id],
    }),
    specialClinic: one(SpecialClinicTable, {
        fields: [SpecialClinicScheduleTable.specialClinicId],
        references: [SpecialClinicTable.id],
    }),
    doctor: one(DoctorTable, {
        fields: [SpecialClinicScheduleTable.doctorId],
        references: [DoctorTable.id],
    }),
    details: many(SpecialClinicScheduleDetailTable),
}));

export const specialClinicScheduleDetailRelations = relations(SpecialClinicScheduleDetailTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [SpecialClinicScheduleDetailTable.hospitalId],
        references: [HospitalTable.id],
    }),
    schedule: one(SpecialClinicScheduleTable, {
        fields: [SpecialClinicScheduleDetailTable.specialClinicScheduleId],
        references: [SpecialClinicScheduleTable.id],
    }),
}));