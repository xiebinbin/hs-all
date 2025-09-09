"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User } from "lucide-react";
import { PatientForm } from "@/components/patient-form";
import { PatientInfo } from "@/types/booking";

interface PatientSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPatient: (patient: PatientInfo) => void;
}

export function PatientSelectionModal({ open, onClose, onSelectPatient }: PatientSelectionModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // 模拟患者数据
  const [patients, setPatients] = useState<PatientInfo[]>([
    {
      id: 1,
      name: "张三",
      socialSecurityNumber: "110101199001011234",
      phone: "13800138000",
      age: 34,
      gender: "男",
      lastVisit: "2024-01-15",
      address: "北京市朝阳区"
    },
    {
      id: 2,
      name: "李四",
      socialSecurityNumber: "110101199502021234",
      phone: "13900139000",
      age: 29,
      gender: "女",
      lastVisit: "2024-02-20",
      address: "北京市海淀区"
    }
  ]);

  const handleSelectPatient = (patient: PatientInfo) => {
    onSelectPatient(patient);
    onClose();
  };

  const handleAddPatient = (patientData: any) => {
    const newPatient: PatientInfo = {
      id: Date.now(),
      ...patientData
    };
    setPatients(prev => [...prev, newPatient]);
    setShowAddForm(false);
    onSelectPatient(newPatient);
    onClose();
  };

  const formatLastVisit = (dateStr?: string) => {
    if (!dateStr) return "首次就诊";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {showAddForm ? "添加患者" : "选择就诊患者"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {showAddForm ? (
            <div className="space-y-4">
              <PatientForm
                onSave={handleAddPatient}
              />
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="w-full"
              >
                返回患者列表
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 添加新患者按钮 */}
              <Button 
                variant="outline" 
                className="w-full h-12 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                添加新患者
              </Button>
              
              {/* 患者列表 */}
              {patients.map((patient) => (
                <Card 
                  key={patient.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectPatient(patient)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-3">
                        <AvatarFallback>{patient.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{patient.name}</h3>
                          <span className="text-xs text-gray-500">{patient.gender} · {patient.age}岁</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">手机: {patient.phone}</p>
                        <p className="text-xs text-gray-500">上次就诊: {formatLastVisit(patient.lastVisit)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {patients.length === 0 && (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">暂无患者信息</p>
                  <p className="text-gray-400 text-xs">请添加患者信息后进行预约</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}