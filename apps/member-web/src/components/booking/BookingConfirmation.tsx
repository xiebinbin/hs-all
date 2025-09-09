"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, User, Phone, AlertCircle, Plus } from "lucide-react";
import { PatientSelectionModal } from "./PatientSelectionModal";
import { BookingData, PatientInfo } from "@/types/booking";
import { useState } from "react";

interface BookingConfirmationProps {
  bookingData: BookingData;
  onNext: (data: Partial<BookingData>) => void;
  onPrevious?: () => void;
}

export function BookingConfirmation({ bookingData, onNext }: BookingConfirmationProps) {
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // 计算年龄的函数
  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSelectPatient = (patient: PatientInfo) => {
    setSelectedPatient(patient);
  };

  const handleConfirmBooking = () => {
      // 这里可以调用API提交预约
      onNext({
        patient: selectedPatient || undefined,
        // 为了兼容性，同时设置原有字段
        patientName: selectedPatient?.name,
        patientPhone: selectedPatient?.phone,
      patientIdCard: selectedPatient?.socialSecurityNumber
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekday}`;
  };

  const getClinicTypeText = () => {
    switch (bookingData.clinicType) {
      case 'general': return '普通门诊';
      case 'expert': return '专家门诊';
      case 'external': return '外院专家';
      default: return '';
    }
  };



  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">确认预约信息</h2>
        <p className="text-sm text-gray-500">请仔细核对预约信息，确认无误后提交</p>
      </div>

      {/* 医院信息 */}
      <Card className="bg-white shadow-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">就诊医院</h3>
          </div>
          <p className="text-sm text-gray-600">{bookingData.hospitalName}</p>
        </CardContent>
      </Card>

      {/* 门诊类型 */}
      <Card className="bg-white shadow-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">门诊类型</h3>
              <p className="text-sm text-gray-600">{getClinicTypeText()}</p>
            </div>
            <Badge 
              className={`${
                bookingData.clinicType === 'general'
                  ? 'bg-green-100 text-green-700'
                  : bookingData.clinicType === 'expert'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
              }`}
            >
              {getClinicTypeText()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 科室/医生信息 */}
      {bookingData.clinicType === 'general' ? (
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">就诊科室</h3>
            </div>
            <p className="text-sm text-gray-600">{bookingData.departmentName}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">就诊医生</h3>
            </div>
            <div className="flex items-center">
              <Avatar className="w-12 h-12 mr-3">
                <AvatarImage src={`/avatars/${bookingData.doctorId}.jpg`} alt={bookingData.doctorName} />
                <AvatarFallback>{bookingData.doctorName?.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{bookingData.doctorName}</p>
                <p className="text-sm text-gray-600">{bookingData.doctorTitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 就诊时间 */}
      <Card className="bg-white shadow-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">就诊时间</h3>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <p className="text-sm text-gray-500 mb-1">日期</p>
              <p className="font-medium text-gray-900">{formatDate(bookingData.appointmentDate!)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">时间</p>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-1" />
                <p className="font-medium text-gray-900">{bookingData.appointmentTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 患者信息 */}
      <Card className="bg-white shadow-sm mb-4">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">就诊患者</h3>
          </div>
          
          {selectedPatient ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarFallback>{selectedPatient.name?.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                  <p className="text-sm text-gray-600">{selectedPatient.gender} · {calculateAge(selectedPatient.birthday)}岁</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPatientModal(true)}
              >
                更换
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full h-12 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600"
              onClick={() => setShowPatientModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              选择就诊患者
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 温馨提示 */}
      <Card className="bg-amber-50 border-amber-200 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-900 mb-2">就诊提醒</h4>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• 请提前15-30分钟到达医院</li>
                <li>• 携带身份证和相关病历资料</li>
                <li>• 如需取消或改期，请提前联系医院</li>
                {bookingData.clinicType === 'external' && (
                  <li>• 外院专家号源珍贵，请准时就诊</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 联系方式 */}
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <Phone className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">联系方式</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">预约咨询</span>
              <span className="text-blue-600">400-123-4567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">医院总机</span>
              <span className="text-blue-600">021-12345678</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 确认按钮 */}
      <div className="space-y-3">
        <Button 
          onClick={handleConfirmBooking}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          确认预约
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          点击确认预约即表示您同意
          <span className="text-blue-600 underline">《预约服务协议》</span>
          和
          <span className="text-blue-600 underline">《隐私政策》</span>
        </p>
      </div>

      {/* 患者选择模态框 */}
       <PatientSelectionModal
         open={showPatientModal}
         onClose={() => setShowPatientModal(false)}
         onSelectPatient={handleSelectPatient}
       />
    </div>
  );
}