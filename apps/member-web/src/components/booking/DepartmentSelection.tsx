"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Bone, Eye, Ear, Baby, Users, ChevronRight } from "lucide-react";
import { BookingData } from "@/types/booking";

interface Department {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  availableSlots: number;
  specialties: string[];
}

interface DepartmentSelectionProps {
  bookingData: BookingData;
  onNext: (data: Partial<BookingData>) => void;
  onPrevious?: () => void;
}

export function DepartmentSelection({  onNext }: DepartmentSelectionProps) {
  const departments: Department[] = [
    {
      id: "internal",
      name: "内科",
      description: "内科疾病诊疗",
      icon: <Heart className="w-5 h-5 text-red-600" />,
      availableSlots: 12,
      specialties: ["高血压", "糖尿病", "感冒发烧", "消化不良"]
    },
    {
      id: "surgery",
      name: "外科",
      description: "外科疾病诊疗",
      icon: <Bone className="w-5 h-5 text-blue-600" />,
      availableSlots: 8,
      specialties: ["外伤处理", "小手术", "伤口缝合", "骨折处理"]
    },
    {
      id: "neurology",
      name: "神经内科",
      description: "神经系统疾病",
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      availableSlots: 6,
      specialties: ["头痛", "失眠", "神经痛", "记忆力下降"]
    },
    {
      id: "ophthalmology",
      name: "眼科",
      description: "眼部疾病诊疗",
      icon: <Eye className="w-5 h-5 text-green-600" />,
      availableSlots: 10,
      specialties: ["视力检查", "眼部感染", "干眼症", "近视"]
    },
    {
      id: "ent",
      name: "耳鼻喉科",
      description: "耳鼻喉疾病诊疗",
      icon: <Ear className="w-5 h-5 text-orange-600" />,
      availableSlots: 7,
      specialties: ["咽喉炎", "鼻炎", "中耳炎", "听力检查"]
    },
    {
      id: "pediatrics",
      name: "儿科",
      description: "儿童疾病诊疗",
      icon: <Baby className="w-5 h-5 text-pink-600" />,
      availableSlots: 15,
      specialties: ["儿童感冒", "疫苗接种", "生长发育", "儿童体检"]
    },
    {
      id: "geriatrics",
      name: "老年科",
      description: "老年疾病诊疗",
      icon: <Users className="w-5 h-5 text-gray-600" />,
      availableSlots: 9,
      specialties: ["慢性病管理", "老年体检", "康复指导", "用药咨询"]
    }
  ];

  const handleDepartmentSelect = (department: Department) => {
    onNext({
      departmentId: department.id,
      departmentName: department.name
    });
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">选择科室</h2>
        <p className="text-sm text-gray-500">请选择您需要就诊的科室</p>
      </div>

      <div className="space-y-3">
        {departments.map((department) => (
          <Card 
            key={department.id}
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDepartmentSelect(department)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {department.icon}
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{department.name}</h3>
                      <p className="text-sm text-gray-500">{department.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <span className="text-xs text-gray-500 mr-1">可预约:</span>
                    <Badge 
                      className={`text-xs ${
                        department.availableSlots > 10 
                          ? 'bg-green-100 text-green-700'
                          : department.availableSlots > 5
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {department.availableSlots}个号源
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {department.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-xs text-gray-600 border-gray-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {department.specialties.length > 3 && (
                      <Badge 
                        variant="outline"
                        className="text-xs text-gray-500 border-gray-300"
                      >
                        +{department.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">科室介绍</h4>
          <p className="text-xs text-blue-700">
            各科室均配备专业医护人员，提供优质的医疗服务。如不确定选择哪个科室，建议先选择内科进行初步诊断。
          </p>
        </div>
      </div>
    </div>
  );
}