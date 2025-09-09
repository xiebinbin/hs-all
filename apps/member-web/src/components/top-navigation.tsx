import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TopNavigationProps {
  title: string;
  backUrl?: string;
  showMoreButton?: boolean;
  onMoreClick?: () => void;
  onBackClick?: () => void;
}

export function TopNavigation({ 
  title, 
  backUrl, 
  showMoreButton = true, 
  onMoreClick,
  onBackClick 
}: TopNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center px-4 py-3 relative">
        {(backUrl || onBackClick) && (
          backUrl ? (
            <Link href={backUrl}>
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={onBackClick}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )
        )}
        <h1 className="text-lg font-medium absolute left-1/2 transform -translate-x-1/2">
          {title}
        </h1>
        {showMoreButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 ml-auto"
            onClick={onMoreClick}
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}