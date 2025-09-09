"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PatientData {
  id?: number;
  name: string;
  socialSecurityNumber: string;
  phone: string;
  age: number;
  gender: string;
  lastVisit?: string;
  address?: string;
}

interface PatientFormProps {
  initialData?: PatientData;
  onSave: (data: PatientData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export function PatientForm({ 
  initialData, 
  onSave,
  onDelete, 
  isEditing = false 
}: PatientFormProps) {
  const [formData, setFormData] = useState<PatientData>({
    name: initialData?.name || "",
    socialSecurityNumber: initialData?.socialSecurityNumber || "",
    phone: initialData?.phone || "",
    age: initialData?.age || 0,
    gender: initialData?.gender || "男",
    lastVisit: initialData?.lastVisit || "",
    address: initialData?.address || "",
    ...initialData
  });

  const handleInputChange = (field: keyof PatientData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="请输入患者姓名"
                className="w-full"
              />
            </div>
            
            <Separator />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                社保号
              </label>
              <Input
                value={formData.socialSecurityNumber}
                onChange={(e) => handleInputChange('socialSecurityNumber', e.target.value)}
                placeholder="请输入社保号"
                className="w-full"
              />
            </div>
            
            <Separator />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="男"
                    checked={formData.gender === '男'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  男
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="女"
                    checked={formData.gender === '女'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  女
                </label>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年龄
              </label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                placeholder="请输入年龄"
                className="w-full"
              />
            </div>
            
            <Separator />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="请输入手机号"
                className="w-full"
              />
            </div>
            
            <Separator />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址
              </label>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="请输入地址"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="space-y-3">
        <Button 
          onClick={handleSubmit}
          className="w-full h-12"
        >
          {isEditing ? "保存修改" : "添加患者"}
        </Button>
        
        {isEditing && onDelete && (
          <Button 
            onClick={onDelete}
            variant="outline"
            className="w-full h-12 text-red-600 border-red-600 hover:bg-red-50"
          >
            删除成员
          </Button>
        )}
      </div>
    </div>
  );
}