/**
 * 数据库枚举类型定义
 * 对应Laravel模型中的enum字段
 */

/**
 * 通用状态枚举
 */
export const StatusEnum = {
    ENABLED: "enabled",
    DISABLED: "disabled",
} as const;
export type Status = typeof StatusEnum[keyof typeof StatusEnum];

/**
 * 性别枚举
 */
export const GenderEnum = {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
} as const;
export type Gender = typeof GenderEnum[keyof typeof GenderEnum];

/**
 * 门诊时段分组枚举
 */
export const ClinicScheduleGroupEnum = {
    MORNING: "morning",
    AFTERNOON: "afternoon",
} as const;
export type ClinicScheduleGroup = typeof ClinicScheduleGroupEnum[keyof typeof ClinicScheduleGroupEnum];

/**
 * 门诊排班状态枚举
 */
export const ClinicScheduleStatusEnum = {
    NORMAL: "normal",
    SUSPENDED: "suspended",
    CANCELLED: "cancelled",
} as const;
export type ClinicScheduleStatus = typeof ClinicScheduleStatusEnum[keyof typeof ClinicScheduleStatusEnum];

/**
 * 预约状态枚举
 */
export const AppointmentStatusEnum = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    USER_CANCELLED: "user_cancelled",
    SYSTEM_CANCELLED: "system_cancelled",
} as const;
export type AppointmentStatus = typeof AppointmentStatusEnum[keyof typeof AppointmentStatusEnum];

/**
 * 短信状态枚举
 */
export const SmsStatusEnum = {
    PENDING: "pending",
    SENT: "sent",
    FAILED: "failed",
} as const;
export type SmsStatus = typeof SmsStatusEnum[keyof typeof SmsStatusEnum];

/**
 * 短信服务提供商枚举
 */
export const SmsProviderEnum = {
    ALIYUN: "aliyun",
    TENCENT: "tencent",
    HUAWEI: "huawei",
} as const;
export type SmsProvider = typeof SmsProviderEnum[keyof typeof SmsProviderEnum];

/**
 * 短信类型枚举
 */
export const SmsTypeEnum = {
    GENERAL: "general",
    VERIFICATION: "verification",
    NOTIFICATION: "notification",
} as const;
export type SmsType = typeof SmsTypeEnum[keyof typeof SmsTypeEnum];