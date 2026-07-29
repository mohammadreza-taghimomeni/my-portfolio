"use client";

import { useInView, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import homeData from "@/data/home.json";
import SectionContainer from "@/components/shared/SectionContainer";
import { HomeData, StatItemProps } from "@/types/home";

const typedHomeData = homeData as HomeData;

const StatItem = ({ label, valueString, index }: StatItemProps) => {
   const ref = useRef(null);
   const isInView = useInView(ref, {
      once: true,
      amount: "some",
      margin: "0px 0px -50px 0px"
   });

   // Parse valueString into parts
   // e.g., "8+"    -> prefix: "",  value: 8,  suffix: "+"
   // e.g., "~60%"  -> prefix: "~", value: 60, suffix: "%"
   const match = valueString.match(/(\D*)(\d+)(.*)/);
   const prefix = match?.[1] ?? "";
   const finalValue = match ? parseInt(match[2], 10) : 0;
   const suffix = match?.[3] ?? "";

   // SSR-friendly: initialize with the final value so server-rendered HTML is correct.
   // Users never see 0 — the count-up animation becomes a decorative enhancement.
   const [displayValue, setDisplayValue] = useState(finalValue);
   const hasAnimatedRef = useRef(false);

   useEffect(() => {
      if (!isInView || hasAnimatedRef.current) return;

      // Respect user's motion preference
      const prefersReducedMotion = window.matchMedia(
         "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      hasAnimatedRef.current = true;

      // Start from ~70 % of the final value for a subtle count-up.
      // The first RAF callback handles the initial reset, avoiding
      // synchronous setState in the effect body which could trigger
      // cascading renders in React 18+ StrictMode.
      const startValue = Math.max(0, Math.floor(finalValue * 0.7));
      const duration = 600;
      let startTime: number | null = null;
      let frameId: number;

      const animate = (currentTime: number) => {
         if (!startTime) startTime = currentTime;
         const elapsed = currentTime - startTime;
         const progress = Math.min(elapsed / duration, 1);

         // Easing function: easeOutExpo
         const easeOutExpo = (x: number): number =>
            x === 1 ? 1 : 1 - Math.pow(2, -10 * x);

         const easedProgress = easeOutExpo(progress);
         const current = Math.floor(
            easedProgress * (finalValue - startValue) + startValue
         );

         setDisplayValue(current);

         if (progress < 1) {
            frameId = requestAnimationFrame(animate);
         }
      };

      frameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameId);
   }, [isInView, finalValue]);

   return (
      <m.div
         ref={ref}
         initial={{ y: 10, scale: 0.95 }}
         whileInView={{ y: 0, scale: 1 }}
         viewport={{ once: true, amount: "some", margin: "0px 0px -50px 0px" }}
         transition={{
            duration: 0.4,
            delay: index * 0.05,
            ease: [0.21, 1.11, 0.81, 0.99]
         }}
         className="flex flex-col items-center justify-center p-6 border-zinc-200 dark:border-zinc-800 odd:border-r md:odd:border-r md:border-r md:last:border-r-0 group hover:bg-white dark:hover:bg-zinc-800/50 transition-colors duration-300 rounded-2xl"
      >
         <m.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-primary transition-colors"
         >
            {prefix}{displayValue}{suffix}
         </m.div>
         <div className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base text-center font-medium uppercase tracking-wider group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
            {label}
         </div>
      </m.div>
   );
};

const Stats = () => {
   return (
      <section className="bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800">
         <SectionContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-8">
               {typedHomeData.stats.map((stat, index) => (
                  <StatItem
                     key={index}
                     index={index}
                     label={stat.label}
                     valueString={stat.value}
                  />
               ))}
            </div>
         </SectionContainer>
      </section>
   );
};

export default Stats;
