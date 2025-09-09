"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, UserCheck, Building2, ChevronRight } from "lucide-react";
import { BookingData, ClinicType } from "@/types/booking";

interface ClinicOption {
  type: ClinicType;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

interface ClinicTypeSelectionProps {
  bookingData: BookingData;
  onNext: (data: Partial<BookingData>) => void;
  onPrevious?: () => void;
}

export function ClinicTypeSelection({ onNext }: ClinicTypeSelectionProps) {
  const clinicOptions: ClinicOption[] = [
    {
      type: 'general',
      title: '普通门诊',
      description: '常见疾病诊疗，基础医疗服务',
      icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
      features: ['常见疾病诊疗', '基础检查', '药物治疗', '健康咨询']
    },
    {
      type: 'expert',
      title: '专家门诊',
      description: '资深专家诊疗，疑难疾病处理',
      icon: <UserCheck className="w-6 h-6 text-orange-600" />,
      features: ['专家诊疗', '疑难疾病', '个性化治疗', '深度咨询']
    },
    {
      type: 'external',
      title: '外院专家',
      description: '知名医院专家，顶级医疗服务',
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      features: ['知名专家', '顶级服务', '前沿技术', 'VIP体验']
    }
  ];

  const handleClinicTypeSelect = (clinicType: ClinicType) => {
    onNext({ clinicType });
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">选择门诊类型</h2>
        <p className="text-sm text-gray-500">根据您的需求选择合适的门诊类型</p>
      </div>

      <div className="space-y-4">
        {clinicOptions.map((option) => (
          <Card 
            key={option.type}
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleClinicTypeSelect(option.type)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    {option.icon}
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {option.features.map((feature, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600"
                      >
                        {feature}
                      </Badge>
                    ))}
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
          <h4 className="text-sm font-medium text-blue-900 mb-2">选择建议</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>普通门诊</strong>：适合常见疾病、体检、开药等基础需求</li>
            <li>• <strong>专家门诊</strong>：适合疑难疾病、需要专业诊断的情况</li>
            <li>• <strong>外院专家</strong>：适合复杂疾病、需要顶级专家诊疗</li>
          </ul>
        </div>
      </div>
    </div>
  );
}