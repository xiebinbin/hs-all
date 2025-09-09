"use client"

import { EnhancedCarousel, CarouselSlide } from "@/components/enhanced-carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const carouselData = [
  {
    id: 1,
    title: "医院新闻",
    description: "了解医院最新动态和重要通知",
    image: "/api/placeholder/400/200",
    badge: "热门",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "健康科普",
    description: "专业医生为您解答健康疑问",
    image: "/api/placeholder/400/200",
    badge: "推荐",
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "专家介绍",
    description: "权威专家团队为您的健康保驾护航",
    image: "/api/placeholder/400/200",
    badge: "专业",
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "医疗设备",
    description: "先进的医疗设备，精准的诊断治疗",
    image: "/api/placeholder/400/200",
    badge: "先进",
    color: "bg-orange-500"
  },
  {
    id: 5,
    title: "就医指南",
    description: "详细的就医流程，让您就医更便捷",
    image: "/api/placeholder/400/200",
    badge: "便民",
    color: "bg-red-500"
  }
]

export default function CarouselDemo({ params }: { params: { hospitalId: string } }) {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">轮播图组件演示</h1>
        <p className="text-muted-foreground">
          基于 shadcn/ui 的增强版轮播图组件，支持自动播放、指示器、暂停等功能
        </p>
      </div>

      {/* 基础轮播图 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">基础轮播图</h2>
        <EnhancedCarousel className="w-full max-w-4xl mx-auto">
          {carouselData.map((item) => (
            <CarouselSlide key={item.id} className="p-1">
              <Card className="w-full">
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <div className="text-center space-y-2">
                    <div className={`w-16 h-16 ${item.color} rounded-full mx-auto mb-4`} />
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                    <Badge variant="secondary">{item.badge}</Badge>
                  </div>
                </CardContent>
              </Card>
            </CarouselSlide>
          ))}
        </EnhancedCarousel>
      </section>

      {/* 自动播放轮播图 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">自动播放轮播图</h2>
        <p className="text-sm text-muted-foreground">
          每3秒自动切换，鼠标悬停时暂停，支持播放/暂停控制
        </p>
        <EnhancedCarousel 
          className="w-full max-w-4xl mx-auto"
          autoPlay={true}
          autoPlayInterval={3000}
          showPlayPause={true}
          pauseOnHover={true}
        >
          {carouselData.slice(0, 3).map((item) => (
            <CarouselSlide key={item.id} className="p-1">
              <Card className="w-full">
                <CardContent className="flex aspect-video items-center justify-center p-6">
                  <div className="text-center space-y-2">
                    <div className={`w-20 h-20 ${item.color} rounded-lg mx-auto mb-4`} />
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground text-lg">{item.description}</p>
                    <Badge variant="outline" className="text-sm">{item.badge}</Badge>
                  </div>
                </CardContent>
              </Card>
            </CarouselSlide>
          ))}
        </EnhancedCarousel>
      </section>

      {/* 无控制按钮轮播图 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">简洁轮播图</h2>
        <p className="text-sm text-muted-foreground">
          隐藏控制按钮，仅显示指示器
        </p>
        <EnhancedCarousel 
          className="w-full max-w-2xl mx-auto"
          showControls={false}
          autoPlay={true}
          autoPlayInterval={4000}
        >
          {carouselData.slice(0, 4).map((item) => (
            <CarouselSlide key={item.id} className="p-1">
              <div className={`${item.color} rounded-lg p-8 text-white text-center`}>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.description}</p>
              </div>
            </CarouselSlide>
          ))}
        </EnhancedCarousel>
      </section>

      {/* 垂直轮播图 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">垂直轮播图</h2>
        <EnhancedCarousel 
          className="w-full max-w-md mx-auto"
          showIndicators={false}
        >
          {carouselData.slice(0, 3).map((item) => (
            <CarouselSlide key={item.id} className="p-1 aspect-square">
              <Card className="w-full h-full">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <div className={`w-12 h-12 ${item.color} rounded-full mb-4`} />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{item.description}</p>
                </CardContent>
              </Card>
            </CarouselSlide>
          ))}
        </EnhancedCarousel>
      </section>

      {/* 使用说明 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">使用说明</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">主要特性：</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>基于 shadcn/ui 和 Embla Carousel 构建</li>
                  <li>支持自动播放和自定义播放间隔</li>
                  <li>可配置的指示器和控制按钮</li>
                  <li>鼠标悬停暂停功能</li>
                  <li>播放/暂停控制</li>
                  <li>键盘导航支持</li>
                  <li>完全可定制的样式</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">基本用法：</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<EnhancedCarousel
  autoPlay={true}
  autoPlayInterval={3000}
  showIndicators={true}
  showControls={true}
  showPlayPause={true}
  pauseOnHover={true}
>
  <CarouselSlide>内容1</CarouselSlide>
  <CarouselSlide>内容2</CarouselSlide>
  <CarouselSlide>内容3</CarouselSlide>
</EnhancedCarousel>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}