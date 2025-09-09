import { Search, User, Phone, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopNavigation } from "@/components/top-navigation";
import Link from "next/link";

export default async function Patients({ params }: { params: { hospitalId: string } }) {
  const { hospitalId } = await params;

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

  const patients = [
    {
      id: 1,
      name: "谢彬彬",
      socialSecurityNumber: "5107*************357X",
      phone: "138****8888",
      birthday: "1996-03-15",
      gender: "男",
      lastVisit: "2024-01-15",
      address: "上海市浦东新区三林镇"
    },
    {
      id: 2,
      name: "赵靖宇",
      socialSecurityNumber: "5107*************357X",
      phone: "139****9999",
      birthday: "1989-07-22",
      gender: "女",
      lastVisit: "2024-01-12",
      address: "上海市浦东新区三林镇"
    },
    {
      id: 3,
      name: "李明华",
      socialSecurityNumber: "3101*************123X",
      phone: "136****7777",
      birthday: "1982-11-08",
      gender: "男",
      lastVisit: "2024-01-10",
      address: "上海市浦东新区三林镇"
    },
    {
      id: 4,
      name: "王小红",
      socialSecurityNumber: "3101*************456X",
      phone: "135****6666",
      birthday: "1995-05-12",
      gender: "女",
      lastVisit: "2024-01-08",
      address: "上海市浦东新区三林镇"
    },
    {
      id: 5,
      name: "张伟强",
      socialSecurityNumber: "3101*************789X",
      phone: "137****5555",
      birthday: "1986-09-30",
      gender: "男",
      lastVisit: "2024-01-05",
      address: "上海市浦东新区三林镇"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <TopNavigation 
         title="患者列表" 
         backUrl={`/${hospitalId}/home`}
         showMoreButton={false}
       />

      {/* 搜索框 */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索患者姓名、社保号或手机号"
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>
      {/* 添加新患者按钮 */}
      <div className="px-4 py-4">
        <Button 
          className="w-full h-12 shadow-lg"
          asChild
        >
          <Link href={`/${hospitalId}/patients/create`}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加新患者
          </Link>
        </Button>
      </div>

      {/* 患者列表 */}
      <div className="px-4">
        {patients.map((patient, index) => (
          <Link
            key={patient.id}
            href={`/${hospitalId}/patients/${patient.id}`}
            className={index > 0 ? "mt-4 block" : "block"}
          >
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{calculateAge(patient.birthday)}岁 · {patient.gender}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                    <span>社保号：{patient.socialSecurityNumber}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>手机号：{patient.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>最近就诊：{patient.lastVisit}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>地址：{patient.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {/* 分页 */}
      <div className="px-4 py-6">
        <div className="flex justify-center items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            上一页
          </Button>
          <span className="text-sm text-gray-600">第 1 页，共 1 页</span>
          <Button variant="outline" size="sm" disabled>
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}