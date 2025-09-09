"use client";

import { Home as HomeIcon, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavigationProps {
  hospitalId: string;
}

export function BottomNavigation({ hospitalId }: BottomNavigationProps) {
  const pathname = usePathname();
  
  const isHomePage = pathname.includes('/home');
  const isProfilePage = pathname.includes('/profile');
  
  return (
    <>
      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-2 h-16">
          <Link 
            href={`/${hospitalId}/home`} 
            className="flex flex-col items-center justify-center space-y-1"
          >
            <HomeIcon className={`w-5 h-5 ${
              isHomePage ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <span className={`text-xs ${
              isHomePage ? 'text-blue-600 font-medium' : 'text-gray-400'
            }`}>
              首页
            </span>
          </Link>
          <Link 
            href={`/${hospitalId}/profile`} 
            className="flex flex-col items-center justify-center space-y-1"
          >
            <User className={`w-5 h-5 ${
              isProfilePage ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <span className={`text-xs ${
              isProfilePage ? 'text-blue-600 font-medium' : 'text-gray-400'
            }`}>
              我的
            </span>
          </Link>
        </div>
      </div>

      {/* 底部占位，避免内容被固定导航遮挡 */}
      <div className="h-16"></div>
    </>
  );
}