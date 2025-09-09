import * as p from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { StatusEnum, AppointmentStatusEnum, Status, AppointmentStatus, SmsType, SmsProvider, SmsStatusEnum, SmsStatus } from "./enums";
import { relations } from "drizzle-orm";
import { HospitalTable, DistrictTable, DepartmentTable } from "./hospital";
import { DoctorTable, SpecialClinicTable } from "./doctor";
import { GeneralClinicScheduleDetailTable, ExpertClinicScheduleDetailTable, SpecialClinicScheduleDetailTable } from "./schedule";

/**
 * 普通门诊预约表
 * 存储普通门诊的预约信息
 */
export const GeneralClinicAppointmentTable = p.pgTable("general_clinic_appointments", {
    /** 预约唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 院区ID */
    districtId: p.bigint("district_id", { mode: "bigint" }).notNull(),
    /** 科室ID */
    departmentId: p.bigint("department_id", { mode: "bigint" }).notNull(),
    /** 普通门诊排班详情ID */
    generalClinicScheduleDetailId: p.bigint("general_clinic_schedule_detail_id", { mode: "bigint" }).notNull(),
    /** 预约号码 */
    appointmentNumber: p.varchar("appointment_number", { length: 50 }),
    /** 患者姓名 */
    patientName: p.varchar("patient_name", { length: 100 }),
    /** 患者手机号 */
    patientPhone: p.varchar("patient_phone", { length: 20 }),
    /** 患者身份证号 */
    patientIdCard: p.varchar("patient_id_card", { length: 20 }),
    /** 预约日期 */
    appointmentDate: p.date("appointment_date"),
    /** 预约时间段 */
    appointmentTime: p.varchar("appointment_time", { length: 50 }),
    /** 预约状态 */
    appointmentStatus: p.varchar("appointment_status", { length: 20 }).notNull().default(AppointmentStatusEnum.PENDING).$type<AppointmentStatus>(),
    /** 备注 */
    remark: p.text("remark"),
    /** 取消原因 */
    cancelReason: p.text("cancel_reason"),
    /** 取消时间 */
    cancelledAt: p.timestamp("cancelled_at"),
    /** 确认时间 */
    confirmedAt: p.timestamp("confirmed_at"),
    /** 完成时间 */
    completedAt: p.timestamp("completed_at"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("general_clinic_appointment_hospital_id_idx").on(t.hospitalId),
    p.index("general_clinic_appointment_district_id_idx").on(t.districtId),
    p.index("general_clinic_appointment_department_id_idx").on(t.departmentId),
    p.index("general_clinic_appointment_schedule_detail_id_idx").on(t.generalClinicScheduleDetailId),
    p.index("general_clinic_appointment_patient_phone_idx").on(t.patientPhone),
    p.index("general_clinic_appointment_number_idx").on(t.appointmentNumber),
    p.index("general_clinic_appointment_status_idx").on(t.appointmentStatus),
]);

/**
 * 专家门诊预约表
 * 存储专家门诊的预约信息
 */
export const ExpertClinicAppointmentTable = p.pgTable("expert_clinic_appointments", {
    /** 预约唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 院区ID */
    districtId: p.bigint("district_id", { mode: "bigint" }).notNull(),
    /** 医生ID */
    doctorId: p.bigint("doctor_id", { mode: "bigint" }).notNull(),
    /** 专家门诊排班详情ID */
    expertClinicScheduleDetailId: p.bigint("expert_clinic_schedule_detail_id", { mode: "bigint" }).notNull(),
    /** 预约号码 */
    appointmentNumber: p.varchar("appointment_number", { length: 50 }),
    /** 患者姓名 */
    patientName: p.varchar("patient_name", { length: 100 }),
    /** 患者手机号 */
    patientPhone: p.varchar("patient_phone", { length: 20 }),
    /** 患者身份证号 */
    patientIdCard: p.varchar("patient_id_card", { length: 20 }),
    /** 预约日期 */
    appointmentDate: p.date("appointment_date"),
    /** 预约时间段 */
    appointmentTime: p.varchar("appointment_time", { length: 50 }),
    /** 预约状态 */
    appointmentStatus: p.varchar("appointment_status", { length: 20 }).notNull().default(AppointmentStatusEnum.PENDING).$type<AppointmentStatus>(),
    /** 备注 */
    remark: p.text("remark"),
    /** 取消原因 */
    cancelReason: p.text("cancel_reason"),
    /** 取消时间 */
    cancelledAt: p.timestamp("cancelled_at"),
    /** 确认时间 */
    confirmedAt: p.timestamp("confirmed_at"),
    /** 完成时间 */
    completedAt: p.timestamp("completed_at"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("expert_clinic_appointment_hospital_id_idx").on(t.hospitalId),
    p.index("expert_clinic_appointment_district_id_idx").on(t.districtId),
    p.index("expert_clinic_appointment_doctor_id_idx").on(t.doctorId),
    p.index("expert_clinic_appointment_schedule_detail_id_idx").on(t.expertClinicScheduleDetailId),
    p.index("expert_clinic_appointment_patient_phone_idx").on(t.patientPhone),
    p.index("expert_clinic_appointment_number_idx").on(t.appointmentNumber),
    p.index("expert_clinic_appointment_status_idx").on(t.appointmentStatus),
]);

/**
 * 特殊门诊预约表
 * 存储特殊门诊的预约信息
 */
export const SpecialClinicAppointmentTable = p.pgTable("special_clinic_appointments", {
    /** 预约唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 院区ID */
    districtId: p.bigint("district_id", { mode: "bigint" }).notNull(),
    /** 特殊门诊ID */
    specialClinicId: p.bigint("special_clinic_id", { mode: "bigint" }).notNull(),
    /** 医生ID */
    doctorId: p.bigint("doctor_id", { mode: "bigint" }).notNull(),
    /** 特殊门诊排班详情ID */
    specialClinicScheduleDetailId: p.bigint("special_clinic_schedule_detail_id", { mode: "bigint" }).notNull(),
    /** 预约号码 */
    appointmentNumber: p.varchar("appointment_number", { length: 50 }),
    /** 患者姓名 */
    patientName: p.varchar("patient_name", { length: 100 }),
    /** 患者手机号 */
    patientPhone: p.varchar("patient_phone", { length: 20 }),
    /** 患者身份证号 */
    patientIdCard: p.varchar("patient_id_card", { length: 20 }),
    /** 预约日期 */
    appointmentDate: p.date("appointment_date"),
    /** 预约时间段 */
    appointmentTime: p.varchar("appointment_time", { length: 50 }),
    /** 预约状态 */
    appointmentStatus: p.varchar("appointment_status", { length: 20 }).notNull().default(AppointmentStatusEnum.PENDING).$type<AppointmentStatus>(),
    /** 备注 */
    remark: p.text("remark"),
    /** 取消原因 */
    cancelReason: p.text("cancel_reason"),
    /** 取消时间 */
    cancelledAt: p.timestamp("cancelled_at"),
    /** 确认时间 */
    confirmedAt: p.timestamp("confirmed_at"),
    /** 完成时间 */
    completedAt: p.timestamp("completed_at"),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("special_clinic_appointment_hospital_id_idx").on(t.hospitalId),
    p.index("special_clinic_appointment_district_id_idx").on(t.districtId),
    p.index("special_clinic_appointment_special_clinic_id_idx").on(t.specialClinicId),
    p.index("special_clinic_appointment_doctor_id_idx").on(t.doctorId),
    p.index("special_clinic_appointment_schedule_detail_id_idx").on(t.specialClinicScheduleDetailId),
    p.index("special_clinic_appointment_patient_phone_idx").on(t.patientPhone),
    p.index("special_clinic_appointment_number_idx").on(t.appointmentNumber),
    p.index("special_clinic_appointment_status_idx").on(t.appointmentStatus),
]);

/**
 * 短信记录表
 * 存储短信发送记录
 */
export const SmsLogTable = p.pgTable("sms_logs", {
    /** 短信记录唯一标识符 */
    id: p.bigserial("id", { mode: "bigint" }).primaryKey(),
    /** 医院ID */
    hospitalId: p.bigint("hospital_id", { mode: "bigint" }).notNull(),
    /** 手机号 */
    phone: p.varchar("phone", { length: 20 }).notNull(),
    /** 短信内容 */
    content: p.text("content"),
    /** 短信类型 */
    smsType: p.varchar("sms_type", { length: 20 }).notNull().$type<SmsType>(),
    /** 短信服务提供商 */
    provider: p.varchar("provider", { length: 20 }).notNull().$type<SmsProvider>(),
    /** 发送状态 */
    smsStatus: p.varchar("sms_status", { length: 20 }).notNull().default(SmsStatusEnum.PENDING).$type<SmsStatus>(),
    /** 发送时间 */
    sentAt: p.timestamp("sent_at"),
    /** 失败原因 */
    failureReason: p.text("failure_reason"),
    /** 外部短信ID */
    externalSmsId: p.varchar("external_sms_id", { length: 100 }),
    /** 重试次数 */
    retryCount: p.integer("retry_count").default(0),
    /** 状态 */
    status: p.varchar("status", { length: 20 }).notNull().default(StatusEnum.ENABLED).$type<Status>(),
    /** 软删除时间 */
    deletedAt: p.timestamp("deleted_at"),
    ...timestamps,
}, (t) => [
    p.index("sms_log_hospital_id_idx").on(t.hospitalId),
    p.index("sms_log_phone_idx").on(t.phone),
    p.index("sms_log_sms_type_idx").on(t.smsType),
    p.index("sms_log_sms_status_idx").on(t.smsStatus),
    p.index("sms_log_sent_at_idx").on(t.sentAt),
]);

// 关系定义
export const generalClinicAppointmentRelations = relations(GeneralClinicAppointmentTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [GeneralClinicAppointmentTable.hospitalId],
        references: [HospitalTable.id],
    }),
    district: one(DistrictTable, {
        fields: [GeneralClinicAppointmentTable.districtId],
        references: [DistrictTable.id],
    }),
    department: one(DepartmentTable, {
        fields: [GeneralClinicAppointmentTable.departmentId],
        references: [DepartmentTable.id],
    }),
    scheduleDetail: one(GeneralClinicScheduleDetailTable, {
        fields: [GeneralClinicAppointmentTable.generalClinicScheduleDetailId],
        references: [GeneralClinicScheduleDetailTable.id],
    }),
}));

export const expertClinicAppointmentRelations = relations(ExpertClinicAppointmentTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [ExpertClinicAppointmentTable.hospitalId],
        references: [HospitalTable.id],
    }),
    district: one(DistrictTable, {
        fields: [ExpertClinicAppointmentTable.districtId],
        references: [DistrictTable.id],
    }),
    doctor: one(DoctorTable, {
        fields: [ExpertClinicAppointmentTable.doctorId],
        references: [DoctorTable.id],
    }),
    scheduleDetail: one(ExpertClinicScheduleDetailTable, {
        fields: [ExpertClinicAppointmentTable.expertClinicScheduleDetailId],
        references: [ExpertClinicScheduleDetailTable.id],
    }),
}));

export const specialClinicAppointmentRelations = relations(SpecialClinicAppointmentTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [SpecialClinicAppointmentTable.hospitalId],
        references: [HospitalTable.id],
    }),
    district: one(DistrictTable, {
        fields: [SpecialClinicAppointmentTable.districtId],
        references: [DistrictTable.id],
    }),
    specialClinic: one(SpecialClinicTable, {
        fields: [SpecialClinicAppointmentTable.specialClinicId],
        references: [SpecialClinicTable.id],
    }),
    doctor: one(DoctorTable, {
        fields: [SpecialClinicAppointmentTable.doctorId],
        references: [DoctorTable.id],
    }),
    scheduleDetail: one(SpecialClinicScheduleDetailTable, {
        fields: [SpecialClinicAppointmentTable.specialClinicScheduleDetailId],
        references: [SpecialClinicScheduleDetailTable.id],
    }),
}));

export const smsLogRelations = relations(SmsLogTable, ({ one }) => ({
    hospital: one(HospitalTable, {
        fields: [SmsLogTable.hospitalId],
        references: [HospitalTable.id],
    }),
}));