"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { BookingData } from "@/types/booking";
import Link from "next/link";

interface BookingSuccessProps {
  bookingData: BookingData;
  hospitalId: string;
}

export function BookingSuccess({ bookingData, hospitalId }: BookingSuccessProps) {
  // 生成预约单号
  const generateBookingNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `YY${timestamp}${random}`;
  };

  const bookingNumber = generateBookingNumber();

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
      {/* 成功状态 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">预约成功！</h2>
        <p className="text-sm text-gray-500">您的预约已确认，请按时就诊</p>
      </div>

      {/* 预约单号 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-blue-600 mb-1">预约单号</p>
          <p className="text-2xl font-bold text-blue-900 tracking-wider">{bookingNumber}</p>
          <p className="text-xs text-blue-500 mt-1">请保存此单号，就诊时出示</p>
        </CardContent>
      </Card>

      {/* 预约详情 */}
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">预约详情</h3>
          
          <div className="space-y-4">
            {/* 医院信息 */}
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">就诊医院</p>
                <p className="font-medium text-gray-900">{bookingData.hospitalName}</p>
              </div>
            </div>

            <Separator />

            {/* 门诊类型 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">门诊类型</p>
                <p className="font-medium text-gray-900">{getClinicTypeText()}</p>
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

            <Separator />

            {/* 科室/医生 */}
            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">
                  {bookingData.clinicType === 'general' ? '就诊科室' : '就诊医生'}
                </p>
                <p className="font-medium text-gray-900">
                  {bookingData.clinicType === 'general' 
                    ? bookingData.departmentName 
                    : `${bookingData.doctorName} ${bookingData.doctorTitle}`
                  }
                </p>
              </div>
            </div>

            <Separator />

            {/* 就诊时间 */}
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">就诊时间</p>
                <p className="font-medium text-gray-900">
                  {formatDate(bookingData.appointmentDate!)}
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <p className="text-sm text-gray-600">{bookingData.appointmentTime}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 就诊提醒 */}
      <Card className="bg-amber-50 border-amber-200 mb-6">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-amber-900 mb-3">就诊提醒</h4>
          <div className="space-y-2 text-xs text-amber-800">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 mt-1.5"></div>
              <p>请提前30分钟到达医院，完成挂号和候诊手续</p>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 mt-1.5"></div>
              <p>携带身份证、医保卡和相关病历资料</p>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 mt-1.5"></div>
              <p>如需取消或改期，请提前2小时联系医院</p>
            </div>
            {bookingData.clinicType === 'external' && (
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 mt-1.5"></div>
                <p>外院专家号源珍贵，请务必准时就诊</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 联系方式 */}
      <Card className="bg-white shadow-sm mb-8">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <Phone className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">联系方式</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">预约咨询</span>
              <a href="tel:400-123-4567" className="text-blue-600">400-123-4567</a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">医院总机</span>
              <a href="tel:021-12345678" className="text-blue-600">021-12345678</a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="space-y-3">
        
        <Link href={`/${hospitalId}/appointments`}>
          <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
            查看我的预约
          </Button>
        </Link>
        
        <Link href={`/${hospitalId}/home`}>
          <Button variant="outline" className="w-full">
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
}