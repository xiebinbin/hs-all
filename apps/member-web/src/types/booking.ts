// 门诊类型
export type ClinicType = 'general' | 'expert' | 'external';

// 患者信息接口
export interface PatientInfo {
  id?: number;
  name: string;
  socialSecurityNumber: string;
  phone: string;
  age: number;
  gender: string;
  address?: string;
  lastVisit?: string;
}

// 预约数据接口
export interface BookingData {
  hospitalId?: string;
  hospitalName?: string;
  clinicType?: ClinicType;
  departmentId?: string;
  departmentName?: string;
  doctorId?: string;
  doctorName?: string;
  doctorTitle?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  // 保留原有字段以兼容现有代码
  patientName?: string;
  patientPhone?: string;
  patientIdCard?: string;
  // 新增完整患者信息
  patient?: PatientInfo;
}

// 预约步骤枚举
export enum BookingStep {
  HOSPITAL_SELECTION = 'hospital_selection',
  CLINIC_TYPE_SELECTION = 'clinic_type_selection',
  DEPARTMENT_SELECTION = 'department_selection',
  DOCTOR_SELECTION = 'doctor_selection',
  DEPARTMENT_SCHEDULE = 'department_schedule',
  DOCTOR_SCHEDULE = 'doctor_schedule',
  CONFIRMATION = 'confirmation',
  SUCCESS = 'success'
}