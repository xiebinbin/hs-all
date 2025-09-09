"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { TopNavigation } from "@/components/top-navigation";
import { PatientForm } from "@/components/patient-form";

export default function PatientEditPage({ 
  params 
}: { 
  params: Promise<{ hospitalId: string; id: string }> 
}) {
  const router = useRouter();
  const { hospitalId, id } = use(params);
  
  // 模拟患者数据 - 与列表数据保持一致
  const patient = {
    id: 1,
    name: "谢彬彬",
    socialSecurityNumber: "5107*************357X",
    phone: "138****8888",
    age: 28,
    gender: "男",
    lastVisit: "2024-01-15",
    address: "上海市浦东新区三林镇"
  };

  const handleSave = (data: any) => {
    console.log('保存患者信息:', data);
    // 这里可以调用API保存数据
    router.push(`/${hospitalId}/patients`);
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个患者吗？')) {
      console.log('删除患者:', patient.id);
      // 这里可以调用API删除数据
      router.push(`/${hospitalId}/patients`);
    }
  };

  const handleCancel = () => {
    router.push(`/${hospitalId}/patients`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        title="患者详情" 
        backUrl={`/${hospitalId}/patients`}
        showMoreButton={false}
      />
      
      <div className="p-4">
        <PatientForm
          initialData={patient}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          isEditing={true}
        />
      </div>
    </div>
  );
}