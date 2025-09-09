"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

interface EnhancedCarouselProps {
  children: React.ReactNode
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  showIndicators?: boolean
  showControls?: boolean
  showPlayPause?: boolean
  pauseOnHover?: boolean
}

interface CarouselIndicatorsProps {
  api: CarouselApi
  count: number
  current: number
  className?: string
}

function CarouselIndicators({ api, count, current, className }: CarouselIndicatorsProps) {
  return (
    <div className={cn("flex justify-center space-x-2 mt-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            current === index
              ? "bg-primary scale-125"
              : "bg-primary/30 hover:bg-primary/50"
          )}
          onClick={() => api?.scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

export function EnhancedCarousel({
  children,
  className,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
  showControls = true,
  showPlayPause = false,
  pauseOnHover = true,
  ...props
}: EnhancedCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  const [isHovered, setIsHovered] = React.useState(false)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // 获取轮播图信息
  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // 自动播放逻辑
  React.useEffect(() => {
    if (!api || !isPlaying || (pauseOnHover && isHovered)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0) // 回到第一张
      }
    }, autoPlayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [api, isPlaying, isHovered, autoPlayInterval, pauseOnHover])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Carousel
        setApi={setApi}
        className="w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <CarouselContent>
          {React.Children.map(children, (child, index) => (
            <CarouselItem key={index}>{child}</CarouselItem>
          ))}
        </CarouselContent>
        
        {showControls && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
        
        {showPlayPause && autoPlay && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 size-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isPlaying ? "Pause" : "Play"} slideshow
            </span>
          </Button>
        )}
      </Carousel>
      
      {showIndicators && count > 1 && (
        <CarouselIndicators
          api={api}
          count={count}
          current={current}
          className="mt-4"
        />
      )}
    </div>
  )
}

// 导出一个简单的轮播图项组件
export function CarouselSlide({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-32 items-center justify-center rounded-lg bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}