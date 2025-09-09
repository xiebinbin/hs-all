
import { Calendar, FileText, Home as HomeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/bottom-navigation";
import { EnhancedCarousel, CarouselSlide } from "@/components/enhanced-carousel";
import Link from "next/link";


export default async function Home({ params }: { params: { hospitalId: string } }) {
  const { hospitalId } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部区域 */}
      <div className="bg-primary text-white">
        <div className="px-4 py-6">
          <div className="flex flex-col items-center space-x-3 mb-4">
            <div className="flex item-center">
              <img className="w-8 h-8 mr-1" src="/logo.png" alt="" />
              <div className="flex items-center">
                <h1 className="text-xl font-bold">三林康德社区卫生服务中心</h1>
              </div>
            </div>
            <div className="flex flex-row items-center">
              <div className="w-4/5">
               <p className="text-blue-100 text-sm mt-1">
                面向社会，以促进健康为中心开展预防医疗、保健等教育和计划生育技术指导，&ldquo;六位一体&rdquo;的社区卫生服务。
              </p>
              </div>
              <div className="w-1/5">
                <img src="/home-top-bg.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 轮播图区域 */}
      <div className="px-4 py-4">
        <EnhancedCarousel
          className="w-full"
          autoPlay={true}
          autoPlayInterval={4000}
          showControls={false}
          showIndicators={false}
          pauseOnHover={true}
        >
          <CarouselSlide className="p-1">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">专家义诊活动</h3>
                  <p className="text-blue-100 text-sm">本周六上午9:00-11:00，心血管专家免费义诊</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </CarouselSlide>

          <CarouselSlide className="p-1">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">健康体检套餐</h3>
                  <p className="text-green-100 text-sm">全面体检，关爱健康，预约享受8折优惠</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </CarouselSlide>

          <CarouselSlide className="p-1">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">疫苗接种服务</h3>
                  <p className="text-purple-100 text-sm">儿童疫苗、成人疫苗，安全便捷的接种服务</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </CarouselSlide>
        </EnhancedCarousel>
      </div>

      {/* 功能区域 */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 预约就诊 */}
          <Link href={`/${hospitalId}/booking`}>
            <div className="bg-zinc-200/80 flex items-center p-2 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-1">
                <h3 className="font-medium text-gray-900">预约就诊</h3>
                <p className="text-sm text-gray-500">在线预约就诊</p>
              </div>
            </div>
          </Link>

          {/* 我的预约 */}
          <Link href={`/${hospitalId}/appointments`}>
            <div className="bg-zinc-200/80 flex items-center p-2 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-1">
                <h3 className="font-medium text-gray-900">我的预约</h3>
                <p className="text-sm text-gray-500">查看预约记录</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 最新公告 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">最新公告</h2>
            <Link href={`/${hospitalId}/announcements`}>
              <Button variant="ghost" size="sm" className="text-gray-500">
                查看更多 →
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {/* 公告项 1 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">置顶</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      【康德&ldquo;医&rdquo;问】失眠精神康复疗愈，探索三林康德品牌
                    </h3>
                    <p className="text-xs text-gray-500">1小时前</p>
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>

            {/* 公告项 2 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      【康德便民】三林康德社区卫生服务中心4月份专家坐诊安排出炉
                    </h3>
                    <p className="text-xs text-gray-500">1小时前</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 公告项 3 */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      【康德便民】三林康德社区卫生服务中心清明节门诊安排
                    </h3>
                    <p className="text-xs text-gray-500">1小时前</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation hospitalId={hospitalId} />
    </div>
  );
}