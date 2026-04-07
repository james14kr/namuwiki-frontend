import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/utils/tw.utils";
import Autoplay from "embla-carousel-autoplay";

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  verticalHeight?: string;
  prevButtonDisable?: boolean;
  nextButtonDisable?: boolean;
  autoScroll?: boolean;
  autoScrollTime?: number;
  innerArrow?: boolean;
  orientation?: "horizontal";
}

const AppCarousel = ({
  children,
  className,
  itemClassName,
  verticalHeight,
  prevButtonDisable = false,
  nextButtonDisable = false,
  autoScroll = false,
  autoScrollTime = 2000,
  innerArrow = false,
  orientation = "horizontal",
}: CarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      plugins={
        autoScroll
          ? [
              Autoplay({
                delay: autoScrollTime,
              }),
            ]
          : undefined
      }
      orientation={orientation}
      className={cn("w-full", verticalHeight, className)}
    >
      <CarouselContent className={cn(verticalHeight)}>
        {children.map((child, index) => (
          <CarouselItem
            key={index}
            className={cn(`basis-1/${children.length}`, itemClassName)}
          >
            {child}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        disabled={prevButtonDisable}
        className={cn(innerArrow && "left-2 opacity-50")}
      />
      <CarouselNext
        disabled={nextButtonDisable}
        className={cn(innerArrow && "right-2 opacity-50")}
      />
    </Carousel>
  );
};

export default AppCarousel;
