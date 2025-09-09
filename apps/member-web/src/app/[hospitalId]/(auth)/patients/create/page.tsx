"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TopNavigation } from "@/components/top-navigation";
import { PatientForm, PatientData } from "@/components/patient-form";

export default function PatientCreatePage({ 
  params 
}: { 
  params: Promise<{ hospitalId: string }> 
}) {
  const router = useRouter();
  const { hospitalId } = use(params);

  const handleSave = (data: PatientData) => {
    console.log('创建患者信息:', data);
    // 这里可以调用API创建数据
    router.push(`/${hospitalId}/patients`);
  };

  const handleCancel = () => {
    router.push(`/${hospitalId}/patients`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        title="添加患者" 
        backUrl={`/${hospitalId}/patients`}
        showMoreButton={false}
      />
      
      <div className="p-4">
        <PatientForm
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={false}
        />
      </div>
    </div>
  );
}