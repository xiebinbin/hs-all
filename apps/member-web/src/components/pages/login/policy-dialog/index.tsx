'use client'
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserAgreement } from '../user-agreement';
import { PrivacyPolicy } from '../privacy-policy';

type PolicyType = 'user-agreement' | 'privacy-policy';

interface PolicyDialogProps {
  type: PolicyType;
  children: React.ReactNode;
}

export const PolicyDialog = ({ type, children }: PolicyDialogProps) => {
  const [open, setOpen] = useState(false);

  const getTitle = () => {
    switch (type) {
      case 'user-agreement':
        return '用户协议';
      case 'privacy-policy':
        return '隐私政策';
      default:
        return '';
    }
  };

  const getContent = () => {
    switch (type) {
      case 'user-agreement':
        return <UserAgreement />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b">
          <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {getContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 便捷组件
export const UserAgreementDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PolicyDialog type="user-agreement">{children}</PolicyDialog>
);

export const PrivacyPolicyDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PolicyDialog type="privacy-policy">{children}</PolicyDialog>
);

export default PolicyDialog;