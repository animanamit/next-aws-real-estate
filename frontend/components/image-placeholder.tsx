import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"

interface ImagePlaceholderProps {
  className?: string
  width?: number
  height?: number
}

export function ImagePlaceholder({ className, width, height }: ImagePlaceholderProps) {
  return (
    <div 
      className={cn(
        "bg-platinum-silver/30 flex items-center justify-center",
        className
      )}
      style={{ width, height }}
    >
      <ImageIcon className="h-8 w-8 text-warm-grey" />
    </div>
  )
}