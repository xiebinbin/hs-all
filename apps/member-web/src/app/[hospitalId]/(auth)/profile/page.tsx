import { User, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function Profile({ params }: { params: { hospitalId: string } }) {
  const { hospitalId } = await params;
  
  return (
    <div className="min-h-screen">
      {/* 头部用户信息 */}
      <div className="text-gray-900">
        <div className="px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">尾号1524的用户</h1>
              <p className="text-gray-500 text-sm mt-1">已守护您1天</p>
            </div>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="px-2 py-2">
        <div className="space-y-1">
          {/* 预约记录 */}
          <Link href={`/${hospitalId}/appointments`}>
            <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">预约记录</h3>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    →
                  </div>
                </div>
            </div>
          </Link>

          {/* 分割线 */}
          <Separator/>

          {/* 就诊人员 */}
          <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">就诊人员</h3>
                  </div>
                </div>
                <div className="text-gray-400">
                  →
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* 底部医院信息 */}
      <div className="px-4 py-8 mt-12">
        <div className="flex items-center justify-center text-gray-500">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="text-sm px-4">三林康德社区卫生服务中心</p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
      </div>

      <BottomNavigation hospitalId={hospitalId} />
    </div>
  );
}