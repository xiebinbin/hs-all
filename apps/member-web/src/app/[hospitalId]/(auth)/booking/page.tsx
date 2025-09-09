"use client";

import { useState } from "react";
import { use } from "react";
import { TopNavigation } from "@/components/top-navigation";
import { HospitalSelection } from "@/components/booking/HospitalSelection";
import { ClinicTypeSelection } from "@/components/booking/ClinicTypeSelection";
import { DepartmentSelection } from "@/components/booking/DepartmentSelection";
import { DoctorSelection } from "@/components/booking/DoctorSelection";
import { DepartmentSchedule } from "@/components/booking/DepartmentSchedule";
import { DoctorSchedule } from "@/components/booking/DoctorSchedule";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingSuccess } from "@/components/booking/BookingSuccess";

import { BookingData, BookingStep } from '@/types/booking';

export default function BookingPage({ params }: { params: Promise<{ hospitalId: string }> }) {
  const { hospitalId } = use(params);
  
  // 当前步骤状态
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.HOSPITAL_SELECTION);
  
  // 预约数据状态
  const [bookingData, setBookingData] = useState<BookingData>({
    hospitalId,
    hospitalName: '',
    clinicType: 'general'
  });

  // 更新预约数据
  // const updateBookingData = (data: Partial<BookingData>) => {
  //   setBookingData(prev => ({ ...prev, ...data }));
  // };

  // 下一步
  // const nextStep = (step: BookingStep) => {
  //   setCurrentStep(step);
  // };

  // 处理步骤数据更新
  // const handleStepData = (data: Partial<BookingData>) => {
  //   setBookingData(prev => ({ ...prev, ...data }));
  // };

  // 处理院区选择
  const handleHospitalSelect = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(BookingStep.CLINIC_TYPE_SELECTION);
  };

  // 处理门诊类型选择
  const handleClinicTypeSelect = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    // 根据门诊类型决定下一步
    if (data.clinicType === 'general') {
      setCurrentStep(BookingStep.DEPARTMENT_SELECTION);
    } else {
      setCurrentStep(BookingStep.DOCTOR_SELECTION);
    }
  };

  // 处理科室选择
  const handleDepartmentSelect = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(BookingStep.DEPARTMENT_SCHEDULE);
  };

  // 处理医生选择
  const handleDoctorSelect = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(BookingStep.DOCTOR_SCHEDULE);
  };

  // 处理排班选择
  const handleScheduleSelect = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(BookingStep.CONFIRMATION);
  };

  // 处理预约确认
  const handleConfirmBooking = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setCurrentStep(BookingStep.SUCCESS);
  };

  // 上一步
  const prevStep = () => {
    switch (currentStep) {
      case BookingStep.CLINIC_TYPE_SELECTION:
        setCurrentStep(BookingStep.HOSPITAL_SELECTION);
        break;
      case BookingStep.DEPARTMENT_SELECTION:
        setCurrentStep(BookingStep.CLINIC_TYPE_SELECTION);
        break;
      case BookingStep.DOCTOR_SELECTION:
        setCurrentStep(BookingStep.CLINIC_TYPE_SELECTION);
        break;
      case BookingStep.DEPARTMENT_SCHEDULE:
        setCurrentStep(BookingStep.DEPARTMENT_SELECTION);
        break;
      case BookingStep.DOCTOR_SCHEDULE:
        setCurrentStep(BookingStep.DOCTOR_SELECTION);
        break;
      case BookingStep.CONFIRMATION:
        if (bookingData.clinicType === 'general') {
          setCurrentStep(BookingStep.DEPARTMENT_SCHEDULE);
        } else {
          setCurrentStep(BookingStep.DOCTOR_SCHEDULE);
        }
        break;
      default:
        break;
    }
  };

  // 获取页面标题
  const getPageTitle = () => {
    switch (currentStep) {
      case BookingStep.HOSPITAL_SELECTION:
        return '选择院区';
      case BookingStep.CLINIC_TYPE_SELECTION:
        return '选择门诊类型';
      case BookingStep.DEPARTMENT_SELECTION:
        return '选择科室';
      case BookingStep.DOCTOR_SELECTION:
        return '选择医生';
      case BookingStep.DEPARTMENT_SCHEDULE:
        return '选择时间';
      case BookingStep.DOCTOR_SCHEDULE:
        return '选择时间';
      case BookingStep.CONFIRMATION:
        return '确认预约';
      case BookingStep.SUCCESS:
        return '预约成功';
      default:
        return '预约就诊';
    }
  };

  // 获取返回URL和处理函数
  const getBackUrl = () => {
    if (currentStep === BookingStep.HOSPITAL_SELECTION) {
      return `/${hospitalId}/home`;
    }
    return undefined; // 使用自定义返回逻辑
  };

  // 处理返回按钮点击
  const handleBackClick = () => {
    if (currentStep === BookingStep.HOSPITAL_SELECTION) {
      // 第一步时返回首页，由 TopNavigation 的 backUrl 处理
      return;
    }
    // 其他步骤使用自定义返回逻辑
    prevStep();
  };

  // 渲染当前步骤组件
  const renderCurrentStep = () => {
    switch (currentStep) {
      case BookingStep.HOSPITAL_SELECTION:
        return (
          <HospitalSelection
          bookingData={bookingData}
          onNext={handleHospitalSelect}
        />
        );
      
      case BookingStep.CLINIC_TYPE_SELECTION:
        return (
          <ClinicTypeSelection
          bookingData={bookingData}
          onNext={handleClinicTypeSelect}
          onPrevious={prevStep}
        />
        );
      
      case BookingStep.DEPARTMENT_SELECTION:
        return (
          <DepartmentSelection
          bookingData={bookingData}
          onNext={handleDepartmentSelect}
          onPrevious={prevStep}
        />
        );
      
      case BookingStep.DOCTOR_SELECTION:
        return (
          <DoctorSelection
          bookingData={bookingData}
          onNext={handleDoctorSelect}
          onPrevious={prevStep}
        />
        );
      
      case BookingStep.DEPARTMENT_SCHEDULE:
        return (
          <DepartmentSchedule
          bookingData={bookingData}
          onNext={handleScheduleSelect}
          onPrevious={prevStep}
        />
        );
      
      case BookingStep.DOCTOR_SCHEDULE:
        return (
          <DoctorSchedule
          bookingData={bookingData}
          onNext={handleScheduleSelect}
          onPrevious={prevStep}
        />
        );
      
      case BookingStep.CONFIRMATION:
        return (
          <BookingConfirmation
          bookingData={bookingData}
          onNext={handleConfirmBooking}
          onPrevious={prevStep}
        />
        );
      
      case BookingStep.SUCCESS:
        return (
          <BookingSuccess bookingData={bookingData} hospitalId={hospitalId} />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <TopNavigation
        title={getPageTitle()}
        backUrl={getBackUrl()}
        onBackClick={currentStep !== BookingStep.HOSPITAL_SELECTION ? handleBackClick : undefined}
        showMoreButton={false}
      />

      {/* 主要内容 */}
      <div className="flex-1">
        {renderCurrentStep()}
      </div>
    </div>
  );
}