"use client";

import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TopNavigation } from "@/components/top-navigation";
import { use } from "react";
import Link from "next/link";

interface Appointment {
  id: number;
  hospitalName: string;
  department: string;
  doctor?: string;
  date: string;
  time: string;
  status: 'success' | 'cancelled';
  type: 'general' | 'specialist' | 'external';
}

export default function Appointments({ params }: { params: Promise<{ hospitalId: string }> }) {
  const { hospitalId } = use(params);

  const appointments: Appointment[] = [
    {
      id: 1,
      hospitalName: "三林康德社区卫生服务中心",
      department: "普通门诊-骨科",
      date: "2024年1月1日",
      time: "周四上午11:00-12:00",
      status: "success",
      type: "general" // id=1: 1%3!==0 && 1%2!==0 -> 普通门诊
    },
    {
      id: 2,
      hospitalName: "和炯社区卫生服务站",
      department: "专家门诊-陈平",
      date: "2024年1月1日",
      time: "周四上午11:00-12:00",
      status: "cancelled",
      type: "specialist" // id=2: 2%3!==0 && 2%2===0 -> 专家门诊
    },
    {
      id: 3,
      hospitalName: "三林康德卫生服务中心",
      department: "外院专家-李教授",
      date: "2024年1月1日",
      time: "周四上午11:00-12:00",
      status: "success",
      type: "external" // id=3: 3%3===0 -> 外院专家
    },
    {
      id: 4,
      hospitalName: "和炯社区卫生服务站",
      department: "专家门诊-王主任",
      date: "2024年1月1日",
      time: "周四上午11:00-12:00",
      status: "cancelled",
      type: "specialist" // id=4: 4%3!==0 && 4%2===0 -> 专家门诊
    },
    {
      id: 5,
      hospitalName: "上海市第一人民医院",
      department: "普通门诊-骨科",
      date: "2024年1月2日",
      time: "周五下午14:00-15:00",
      status: "success",
      type: "general" // id=5: 5%3!==0 && 5%2!==0 -> 普通门诊
    },
    {
      id: 6,
      hospitalName: "复旦大学附属华山医院",
      department: "外院专家-张教授",
      date: "2024年1月3日",
      time: "周六上午09:00-10:00",
      status: "cancelled",
      type: "external" // id=6: 6%3===0 -> 外院专家
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <TopNavigation 
        title="预约记录" 
        backUrl={`/${hospitalId}/home`}
        showMoreButton={true}
      />

      {/* 标签页 */}
      <div className="flex-1">
        <Tabs defaultValue="general" className="h-full flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="general">
                普通门诊
              </TabsTrigger>
              <TabsTrigger value="specialist">
                专家门诊
              </TabsTrigger>
              <TabsTrigger value="external">
                外院专家
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="general" className="flex-1 mt-0">
            <AppointmentList appointments={appointments.filter(apt => apt.type === 'general')} type="general" hospitalId={hospitalId} />
          </TabsContent>
          
          <TabsContent value="specialist" className="flex-1 mt-0">
            <AppointmentList appointments={appointments.filter(apt => apt.type === 'specialist')} type="specialist" hospitalId={hospitalId} />
          </TabsContent>
          
          <TabsContent value="external" className="flex-1 mt-0">
            <AppointmentList appointments={appointments.filter(apt => apt.type === 'external')} type="external" hospitalId={hospitalId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AppointmentList({ appointments, type, hospitalId }: { appointments: Appointment[], type: 'general' | 'specialist' | 'external', hospitalId: string }) {
  return (
    <div className="px-4 py-4">
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} hospitalId={hospitalId} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <Calendar className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">暂无{type === 'general' ? '普通门诊' : '专家门诊'}预约记录</p>
        </div>
      )}

      {/* 分页 */}
      {appointments.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-8 py-4">
          <Button variant="outline" size="sm" disabled>
            <span className="text-gray-400">‹</span>
          </Button>
          <span className="text-sm text-gray-600 px-4">2/20</span>
          <Button variant="outline" size="sm">
            <span className="text-gray-600">›</span>
          </Button>
        </div>
      )}

      {/* 底部提示 */}
      {appointments.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">没有更多内容</p>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment, hospitalId }: { appointment: Appointment; hospitalId: string }) {
  return (
    <Link href={`/${hospitalId}/appointments/${appointment.id}`}>
      <Card className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-4">
        <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{appointment.hospitalName}</h3>
            <p className="text-sm text-gray-600 mb-2">{appointment.department}</p>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{appointment.date}/{appointment.time}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge 
              variant={appointment.status === 'success' ? 'default' : 'destructive'}
              className={`${
                appointment.status === 'success' 
                  ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
              }`}
            >
              {appointment.status === 'success' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  预约成功
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  已取消
                </>
              )}
            </Badge>
          </div>
        </div>
        </CardContent>
      </Card>
    </Link>
  );
}