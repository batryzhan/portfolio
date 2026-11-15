import { useEffect, useState, type JSX } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { ProjectSlide } from "@/content"
import { cn } from "@/lib/utils"

export type { ProjectSlide }

function SlideImage({ slide, index }: { slide: ProjectSlide; index: number }) {
  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
      <img
        src={slide.src}
        srcSet={`${slide.src} ${slide.width}w, ${slide.srcLarge} ${slide.largeWidth}w`}
        sizes="(min-width: 1024px) 640px, 100vw"
        width={slide.width}
        height={slide.height}
        alt={slide.alt}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover object-top"
      />
    </div>
  )
}

export function ProjectCarousel({
  label,
  slides,
  className,
}: {
  label: string
  slides: ProjectSlide[]
  className?: string
}): JSX.Element {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const updateCurrent = () => setCurrent(api.selectedScrollSnap())
    updateCurrent()
    api.on("select", updateCurrent)
    api.on("reInit", updateCurrent)
    return () => {
      api.off("select", updateCurrent)
      api.off("reInit", updateCurrent)
    }
  }, [api])

  if (slides.length === 0) return <div className={className} />

  if (slides.length === 1) {
    return (
      <div className={className}>
        <SlideImage slide={slides[0]} index={0} />
        <p className="mt-3 text-sm text-muted-foreground">{slides[0].caption}</p>
      </div>
    )
  }

  const selected = Math.min(current, slides.length - 1)

  return (
    <Carousel
      className={className}
      aria-label={label}
      aria-roledescription="carousel"
      opts={{ align: "start", loop: false, dragFree: false }}
      setApi={setApi}
    >
      <div className="relative">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={`${slide.src}-${index}`} aria-label={`${index + 1} of ${slides.length}`}>
              <SlideImage slide={slide} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="outline"
          size="icon"
          className="inset-y-auto left-3 top-1/2 size-9 -translate-y-1/2 bg-white/90 shadow-sm backdrop-blur-sm"
        />
        <CarouselNext
          variant="outline"
          size="icon"
          className="inset-y-auto right-3 top-1/2 size-9 -translate-y-1/2 bg-white/90 shadow-sm backdrop-blur-sm"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {slides[selected].caption}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center">
            {slides.map((slide, index) => (
              <button
                key={`${slide.src}-${index}`}
                type="button"
                className="group flex min-h-6 min-w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={`Go to slide ${index + 1} of ${slides.length}`}
                aria-current={index === selected ? "true" : undefined}
                onClick={() => api?.scrollTo(index)}
              >
                <span
                  className={cn(
                    "h-1.5 rounded-full transition-[width] motion-reduce:transition-none",
                    index === selected ? "w-5 bg-primary" : "w-1.5 bg-foreground/20 group-hover:bg-foreground/40"
                  )}
                />
              </button>
            ))}
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {selected + 1} / {slides.length}
          </span>
        </div>
      </div>
    </Carousel>
  )
}
