"use client";

import { Calendar, Clock, MapPin, User, Phone, IdCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TopNavigation } from "@/components/top-navigation";
import { use } from "react";

interface AppointmentDetail {
  id: number;
  patientName: string;
  idCard: string;
  phone: string;
  gender: string;
  hospitalName: string;
  department: string;
  date: string;
  time: string;
  type: '普通门诊' | '专家门诊' | '外院专家';
  status: string;
  doctorName?: string; // 专家门诊才有医生姓名
  doctorTitle?: string; // 专家门诊才有医生职称
  consultationFee?: number; // 专家门诊才有诊疗费
}

export default function AppointmentDetail({ params }: { params: Promise<{ hospitalId: string; id: string }> }) {
  const { hospitalId, id } = use(params);

  // 模拟数据，实际应该从API获取
  const appointment: AppointmentDetail = {
    id: parseInt(id),
    patientName: "赵靖宇",
    idCard: "51078*********357x",
    phone: "176****1524",
    gender: "男",
    hospitalName: "三林康德社区卫生服务中心",
    department: "骨科",
    date: "2023年1月1日/周四",
    time: "上午11:00-12:00",
    type: parseInt(id) % 3 === 0 ? "外院专家" : (parseInt(id) % 2 === 0 ? "专家门诊" : "普通门诊"), // 根据ID模拟不同类型
    status: "预约成功",
    // 专家门诊和外院专家特有信息
    ...(parseInt(id) % 3 === 0 && {
      doctorName: "李教授",
      doctorTitle: "主任医师",
      consultationFee: 200
    }),
    ...(parseInt(id) % 2 === 0 && parseInt(id) % 3 !== 0 && {
      doctorName: "张主任",
      doctorTitle: "主任医师",
      consultationFee: 50
    })
  };

  const isExpertClinic = appointment.type === "专家门诊";
  const isExternalExpert = appointment.type === "外院专家";
  const isSpecialClinic = isExpertClinic || isExternalExpert;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <TopNavigation 
        title={`${appointment.type}详情`}
        backUrl={`/${hospitalId}/appointments`}
        showMoreButton={true}
      />

      <div className="px-4 py-4 space-y-4">
        {/* 专家门诊/外院专家医生信息 */}
        {isSpecialClinic && (
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                <div className="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
                {isExternalExpert ? '外院专家' : '预约医生'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/placeholder-doctor.jpg" alt={appointment.doctorName} />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {appointment.doctorName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-medium text-gray-900">{appointment.doctorName}</span>
                    <Badge className="bg-gray-100 text-gray-600 text-xs">
                      {appointment.doctorTitle}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{appointment.hospitalName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 患者信息 */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
              <div className="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
              患者信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">姓名</span>
              <span className="text-gray-900 font-medium">{appointment.patientName}</span>
            </div>
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">身份证</span>
              <span className="text-gray-900">{appointment.idCard}</span>
            </div>
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">电话</span>
              <span className="text-gray-900">{appointment.phone}</span>
            </div>
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">性别</span>
              <span className="text-gray-900">{appointment.gender}</span>
            </div>
          </CardContent>
        </Card>

        {/* 预约信息 */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
              <div className="w-1 h-5 bg-blue-600 rounded-full mr-3"></div>
              预约信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">院区</span>
              <span className="text-gray-900">{appointment.hospitalName}</span>
            </div>
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">科室</span>
              <span className="text-gray-900">{appointment.department}</span>
            </div>
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">日期</span>
              <span className="text-gray-900">{appointment.date}</span>
            </div>
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">时间</span>
              <span className="text-gray-900">{appointment.time}</span>
            </div>
            <div className="border-t border-gray-100"></div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">类型</span>
              <Badge className={`${
                isExternalExpert 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-100' 
                  : isExpertClinic 
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
              }`}>
                {appointment.type}
              </Badge>
            </div>
            <div className="border-t border-gray-100"></div>
            
            {/* 专家门诊/外院专家诊疗费 */}
             {isSpecialClinic && (
              <>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">诊疗费</span>
                  <span className={`text-gray-900 font-medium ${
                     isExternalExpert ? 'text-purple-600' : 'text-orange-600'
                   }`}>¥{appointment.consultationFee}</span>
                </div>
                <div className="border-t border-gray-100"></div>
              </>
            )}
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">状态</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {appointment.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button 
          className={`w-full h-12 text-white font-medium ${
            isExternalExpert 
              ? 'bg-purple-600 hover:bg-purple-700'
              : isExpertClinic 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={() => {
            // 处理取消预约逻辑
            console.log('取消预约');
          }}
        >
          取消预约
        </Button>
      </div>

      {/* 底部安全区域 */}
      <div className="h-20"></div>
    </div>
  );
}