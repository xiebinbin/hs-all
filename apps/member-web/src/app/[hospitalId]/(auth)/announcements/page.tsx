import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TopNavigation } from "@/components/top-navigation";
import Link from "next/link";

export default async function Announcements({ params }: { params: { hospitalId: string } }) {
  const { hospitalId } = await params;

  const announcements = [
    {
      id: 1,
      title: "【康德医问】失眠精神康复疗愈，探亮三林康德品牌",
      time: "1小时前",
      tag: "置顶",
      image: "/api/placeholder/80/60"
    },
    {
      id: 2,
      title: "【康德便民】三林康德社区卫生服务中心4月份专家坐诊安排出炉",
      time: "1小时前",
      tag: null,
      image: null
    },
    {
      id: 3,
      title: "【康德便民】三林康德社区卫生服务中心清明节门诊安排",
      time: "1小时前",
      tag: null,
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <TopNavigation 
         title="最新公告" 
         backUrl={`/${hospitalId}/home`}
         showMoreButton={false}
       />

      {/* 搜索框 */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索"
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>

      {/* 公告列表 */}
      <div className="px-4">
        {announcements.map((announcement, index) => (
          <Link key={announcement.id} href={`/${hospitalId}/announcements/${announcement.id}`} className={index > 0 ? "mt-4 block" : "block"}>
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  {/* 左侧内容 */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-2 mb-2">
                      {announcement.tag && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          {announcement.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-gray-900 font-medium text-sm leading-5 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-400 text-xs">{announcement.time}</p>
                  </div>
                  
                  {/* 右侧图片 */}
                  {announcement.image && (
                    <div className="w-20 h-15 bg-gray-200 rounded-lg flex-shrink-0">
                      <img
                        src={announcement.image}
                        alt="公告图片"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 没有更多内容提示 */}
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">没有更多内容</p>
      </div>

      {/* 分页器 */}
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="p-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">2/20</span>
          <Button variant="outline" size="sm" className="p-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}