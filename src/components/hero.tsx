/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { MoveRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Đăng ký ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Tách Slider thành component riêng với animation native
const InfiniteSlider = ({ direction = 1 }: { direction?: number }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(direction === 1 ? 0 : -50);
  const IMAGES = Array(10).fill("https://placehold.co/768x1024/333/FFF");

  useEffect(() => {
    let animationFrameId: number;
    const speed = 0.03;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      if (lastTime === 0) {
        lastTime = currentTime;
      }

      const delta = currentTime - lastTime;
      if (delta > 16) {
        setPosition(prev => {
          let newPosition = prev - speed * direction;
          
          // Reset logic khác nhau cho mỗi hướng
          if (direction === 1 && newPosition <= -50) {
            newPosition = 0;
          } else if (direction === -1 && newPosition >= 0) {
            newPosition = -50;
          }
          
          return newPosition;
        });
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction]);

  return (
    <div className="relative w-full h-[320px] overflow-hidden">
      <div 
        className="flex gap-4 absolute left-0 top-0"
        style={{ 
          width: "fit-content",
          transform: `translateX(${position}%)`,
          transition: 'transform 0.2s linear'
        }}
      >
        {IMAGES.concat(IMAGES).concat(IMAGES).map((src, index) => (
          <div 
            key={index} 
            className="w-[200px] inline-block flex-shrink-0"
          >
            <img 
              src={src}
              alt={`Story ${index + 1}`}
              className="w-full h-[300px] object-cover rounded-md shadow-lg"
              loading="eager"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function Hero() {
  const [isLoaded, setIsLoaded] = useState(() => {
    // Kiểm tra xem đã visit chưa ngay khi khởi tạo
    return !!sessionStorage.getItem('hasVisited')
  });
  const [showScroll, setShowScroll] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleOneRef = useRef<HTMLDivElement>(null);
  const titleTwoRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kiểm tra trạng thái loading định kỳ
    if (!isLoaded) {
      const checkLoading = setInterval(() => {
        if (sessionStorage.getItem('hasVisited')) {
          setIsLoaded(true);
          clearInterval(checkLoading);
        }
      }, 100);

      return () => clearInterval(checkLoading);
    }

    // Chỉ chạy các animation khác khi đã loaded xong
    if (!isLoaded) return;

    // Scroll indicator handling
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScroll(false);
      } else {
        setShowScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Scroll indicator animation
    const bounceAnimation = gsap.to(scrollIndicatorRef.current, {
      y: 15,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Content animations với vùng trigger rộng hơn
    const contentTimeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 1,
        ease: "power3.out"
      }
    });

    gsap.set([titleOneRef.current, titleTwoRef.current, descriptionRef.current, buttonsRef.current], {
      x: -100,
      opacity: 0
    });

    contentTimeline
      .to(titleOneRef.current, { x: 0, opacity: 1 })
      .to(titleTwoRef.current, { x: 0, opacity: 1 }, "-=0.7")
      .to(descriptionRef.current, { x: 0, opacity: 1 }, "-=0.7")
      .to(buttonsRef.current, { x: 0, opacity: 1 }, "-=0.7");

    ScrollTrigger.create({
      trigger: contentRef.current,
      start: "top 80%", // Bắt đầu sớm hơn (từ 60% -> 80%)
      end: "bottom 20%", // Kết thúc trễ hơn (từ center -> 20%)
      scrub: 0.5, // Thêm scrub để animation mượt hơn khi scroll
      toggleActions: "play none none reverse",
      onEnter: () => contentTimeline.play(),
      onLeave: () => contentTimeline.reverse(),
      onEnterBack: () => contentTimeline.play(),
      onLeaveBack: () => contentTimeline.reverse(),
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      bounceAnimation.kill();
      contentTimeline.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoaded]);

  // Không render gì nếu chưa load xong
  if (!isLoaded) return null;

  return (
    <div className="w-full overflow-hidden">
      {/* Top Slider */}
      <div className="w-full py-8 bg-muted">
        <InfiniteSlider direction={1} />
      </div>

      {/* Center Content */}
      <div className="container mx-auto px-4 py-16 min-h-[60vh] relative" ref={contentRef}>
        <div className="max-w-7xl mx-auto">
          <Badge variant="outline" className="text-sm font-medium uppercase tracking-wider">Beta</Badge>
          
          {/* Title Section - Staggered Layout */}
          <div className="mt-8">
            <div className="w-full md:w-2/3" ref={titleOneRef}>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
                Sáng Tạo
              </h1>
            </div>
            <div className="w-full md:w-3/4 ml-auto" ref={titleTwoRef}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                Truyện Cùng AI
              </h1>
            </div>
          </div>

          {/* Description - Further Right */}
          <div className="mt-12 w-full md:w-3/5 ml-auto" ref={descriptionRef}>
            <p className="text-2xl text-muted-foreground">
              Biến ý tưởng thành câu chuyện trong tích tắc
            </p>
          </div>
          
          {/* Buttons - Most Right */}
          <div className="mt-12 w-full md:w-1/2 ml-auto" ref={buttonsRef}>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button size="lg" variant="default" className="gap-2 text-lg flex-1">
                Viết Ngay <MoveRight className="w-6 h-6" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-lg flex-1">
                Khám Phá <MoveRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div 
            ref={scrollIndicatorRef}
            className={`fixed left-1/2 bottom-12 transform -translate-x-1/2 transition-opacity duration-500 z-50 ${
              showScroll ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <span className="text-sm font-medium">Cuộn xuống</span>
              <ChevronDown className="w-8 h-8" />
            </div>
          </div>

          {/* Team Members */}
          <div className="absolute bottom-4 left-4 text-sm text-muted-foreground space-y-1">
            <p>Nguyễn Huỳnh Phú Vinh</p>
            <p>Nguyễn Phú Vinh</p>
            <p>Huỳnh Phước Thọ</p>
          </div>
        </div>
      </div>

      {/* Bottom Slider */}
      <div className="w-full py-8 bg-muted">
        <InfiniteSlider direction={-1} />
      </div>
    </div>
  );
}

export { Hero };
