"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";
import { BookingData } from "@/types/booking";

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
}

interface HospitalSelectionProps {
  bookingData: BookingData;
  onNext: (data: Partial<BookingData>) => void;
}

export function HospitalSelection({ bookingData, onNext }: HospitalSelectionProps) {
  // 模拟医院数据
  const hospitals: Hospital[] = [
    {
      id: "1",
      name: "三林康德社区卫生服务中心",
      address: "上海市浦东新区三林路368号",
      distance: "1.2km"
    },
    {
      id: "2", 
      name: "和炯社区卫生服务站",
      address: "上海市浦东新区和炯路123号",
      distance: "2.5km"
    },
    {
      id: "3",
      name: "浦东新区人民医院",
      address: "上海市浦东新区川沙路4425号",
      distance: "5.8km"
    }
  ];

  const handleHospitalSelect = (hospital: Hospital) => {
    onNext({
      hospitalId: hospital.id,
      hospitalName: hospital.name
    });
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">请选择就诊院区</h2>
        <p className="text-sm text-gray-500">选择离您最近的医院院区</p>
      </div>

      <div className="space-y-3">
        {hospitals.map((hospital) => (
          <Card 
            key={hospital.id} 
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleHospitalSelect(hospital)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">{hospital.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{hospital.address}</p>
                  <p className="text-xs text-blue-600">{hospital.distance}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">温馨提示</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 请选择离您最近的医院院区进行就诊</li>
            <li>• 不同院区的科室和医生可能有所不同</li>
            <li>• 建议提前了解院区的交通路线</li>
          </ul>
        </div>
      </div>
    </div>
  );
}