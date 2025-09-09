"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Clock, ChevronRight } from "lucide-react";
import { BookingData } from "@/types/booking";

interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  hospital?: string;
  avatar?: string;
  experience: string;
  specialties: string[];
  availableSlots: number;
  nextAvailable: string;
  isExternal?: boolean;
}

interface DoctorSelectionProps {
  bookingData: BookingData;
  onNext: (data: Partial<BookingData>) => void;
  onPrevious?: () => void;
}

export function DoctorSelection({ bookingData, onNext, onPrevious }: DoctorSelectionProps) {
  // 根据门诊类型显示不同的医生
  const getDoctors = (): Doctor[] => {
    if (bookingData.clinicType === 'expert') {
      return [
        {
          id: "doc1",
          name: "张主任",
          title: "主任医师",
          department: "心血管内科",
          avatar: "/avatars/doctor1.jpg",

          experience: "20年",
          specialties: ["高血压", "冠心病", "心律失常"],
          availableSlots: 8,
          nextAvailable: "今天 14:30",

        },
        {
          id: "doc2",
          name: "李教授",
          title: "副主任医师",
          department: "消化内科",
          avatar: "/avatars/doctor2.jpg",

          experience: "15年",
          specialties: ["胃炎", "肝病", "消化不良"],
          availableSlots: 5,
          nextAvailable: "明天 09:00",

        },
        {
          id: "doc3",
          name: "王医生",
          title: "主治医师",
          department: "神经内科",
          avatar: "/avatars/doctor3.jpg",

          experience: "12年",
          specialties: ["头痛", "失眠", "神经痛"],
          availableSlots: 6,
          nextAvailable: "今天 16:00",

        }
      ];
    } else if (bookingData.clinicType === 'external') {
      return [
        {
          id: "ext1",
          name: "陈院长",
          title: "主任医师 · 博士生导师",
          department: "心胸外科",
          hospital: "上海交通大学医学院附属瑞金医院",
          avatar: "/avatars/expert1.jpg",

          experience: "30年",
          specialties: ["心脏手术", "胸腔镜", "微创手术"],
          availableSlots: 3,
          nextAvailable: "下周一 10:00",

          isExternal: true
        },
        {
          id: "ext2",
          name: "刘专家",
          title: "主任医师 · 硕士生导师",
          department: "神经外科",
          hospital: "复旦大学附属华山医院",
          avatar: "/avatars/expert2.jpg",

          experience: "25年",
          specialties: ["脑肿瘤", "脊柱手术", "神经介入"],
          availableSlots: 2,
          nextAvailable: "下周三 14:00",

          isExternal: true
        }
      ];
    }
    return [];
  };

  const doctors = getDoctors();

  const handleDoctorSelect = (doctor: Doctor) => {
    onNext({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title
    });
  };



  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          选择{bookingData.clinicType === 'external' ? '外院专家' : '专家医生'}
        </h2>
        <p className="text-sm text-gray-500">
          {bookingData.clinicType === 'external' 
            ? '知名医院专家，提供顶级医疗服务'
            : '经验丰富的专家医生，专业诊疗服务'
          }
        </p>
      </div>

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <Card 
            key={doctor.id}
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDoctorSelect(doctor)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start mb-3">
                    <Avatar className="w-12 h-12 mr-3">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="font-medium text-gray-900 mr-2">{doctor.name}</h3>
                        {doctor.isExternal && (
                          <Award className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">{doctor.title}</p>
                      <p className="text-sm text-blue-600">{doctor.department}</p>
                      
                      {doctor.hospital && (
                        <p className="text-xs text-gray-500 mt-1">{doctor.hospital}</p>
                      )}
                      
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500">从业{doctor.experience}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {doctor.specialties.map((specialty, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-xs text-gray-600 border-gray-300"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">最早可约: {doctor.nextAvailable}</span>
                      </div>
                      <Badge 
                        className={`text-xs ${
                          doctor.availableSlots > 5 
                            ? 'bg-green-100 text-green-700'
                            : doctor.availableSlots > 2
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        剩余{doctor.availableSlots}个号
                      </Badge>
                    </div>
                    

                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <div className={`rounded-lg p-4 ${
          bookingData.clinicType === 'external' 
            ? 'bg-purple-50' 
            : 'bg-blue-50'
        }`}>
          <h4 className={`text-sm font-medium mb-2 ${
            bookingData.clinicType === 'external'
              ? 'text-purple-900'
              : 'text-blue-900'
          }`}>
            {bookingData.clinicType === 'external' ? '外院专家说明' : '专家门诊说明'}
          </h4>
          <ul className={`text-xs space-y-1 ${
            bookingData.clinicType === 'external'
              ? 'text-purple-700'
              : 'text-blue-700'
          }`}>
            {bookingData.clinicType === 'external' ? (
              <>
                <li>• 外院专家来自知名三甲医院，具有丰富的临床经验</li>
                <li>• 提供高端医疗服务，适合疑难复杂疾病诊疗</li>
                <li>• 预约时间相对较长，请提前安排就诊时间</li>
              </>
            ) : (
              <>
                <li>• 专家医生具有丰富的临床经验和专业技能</li>
                <li>• 适合需要专业诊断和治疗的疾病</li>
                <li>• 提供专业的诊断和治疗服务，服务质量有保障</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}