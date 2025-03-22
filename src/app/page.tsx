import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { ArrowRight, Book, Check, Target,Languages,  Flame } from "lucide-react";
import Image from "next/image";
import { features } from "../../data/features";

export default function Home() {
  return (
    <>
    <MaxWidthWrapper
      className={cn(
        "min-h-[calc(100vh - 4rem) overflow-hidden bg-secondary/50"
      )}
    >
      <section
        className={cn(
          "flex items-center",
          "min-h-[calc(100vh - 4rem)  relative py-10"
        )}
      >
        <div
          className={cn(
            "absolute top-0 ",
            "h-full bg-background transform skew-x-12 translate-x-32 z-0 ",
            "hidden md:block"
          )}
        />

        <div className="relative z-10 pt-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left">
              <Badge
                variant={"outline"}
                className={cn(
                  "border-primary/10 bg-primary/10 hover:bg-primary/20",
                  "text-primary mb-4"
                )}
              >
                Track your language journey
              </Badge>
              <h1
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                )}
              >
                Master language through
                <span className="relative ml-2">
                  <span className="relative z-10">Immersion</span>
                  <span
                    className={cn(
                      "absolute bottom-2 left-0",
                      "w-full h-3 md:hover:h-4 bg-primary -rotate-2"
                    )}
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Track your progress, set goals, and stay motivated
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href={"/register"}
                  className={buttonVariants({
                    size: "lg",
                    className: "w-full sm:w-auto",
                  })}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                {""}
                <Link
                  href={"/about"}
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "w-full sm:w-auto",
                  })}
                >
                  Read More <Book className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 relative w-full max-w-lg mx-auto">
              <div className="relative w-full aspect-square">
                <div className="absolute  inset-0 bg-gradient-to-tr from-primary/90 to-secondary/10 rounded-lg blur-2xl" />
                {""}

                <div className="relative bg-background rounded-lg border shadow-xl overflow-hidden">
                  <Image
                    alt="preview"
                    src={"/hero.webp"}
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-background/0 " />
              </div>

              <div className="absolute -top-4 -right-4 bg-background rounded-lg border p-4 shadow-lg hidden sm:block ">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Daily Goal</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>30 mins completed</span>{" "}
                    <Check className="w-4 h-4 text-primary" />
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-background rounded-lg border p-4 shadow-lg hidden sm:block ">
<div className="flex items-center gap-3">
  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
    <Languages className="w-5 h-5 text-primary text-orange-500" />
  </div>
  <div className="space-y-0.5" >
    <p className="text-sm font-medium">100 days</p>
    <p className="text-sm text-muted-foreground flex items-center gap-2">
      <span>Streak</span>{" "}
      <Flame className="w-4 h-4 text-primary" />
    </p>
  </div>
</div>
</div>

            </div>

           
        
          </div>
        </div >
      </section>
    </MaxWidthWrapper>
       <section id="features" className="py-16 md:py-20 bg-background">
       <MaxWidthWrapper>
         <div>
           <div className="text-center space-y-4 mb-12 md:mb-16">
             <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">
               Everything you need to track your progress
             </h2>
             <p className="text-lg md:text-xl text-muted-foreground">
               Comprehensive tools designed for serious language learners.
             </p>
           </div>
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {features.map((feature, index) => (
               <div
                 key={index}
                 className={cn(
                   "p-6 rounded-lg",
                   "border border-border",
                   "bg-card hover:bg-accent",
                   "transition-colors duration-300",
                   "group"
                 )}
               >
                 <div className="space-y-4">
                   <div
                     className={cn(
                       "w-12 h-12",
                       "rounded-lg",
                       "bg-primary/10 group-hover:bg-primary/20",
                       "flex items-center justify-center",
                       "transition-colors duration-300"
                     )}
                   >
                     <feature.icon className="w-6 h-6 text-primary" />
                   </div>
                   <h3 className="text-lg md:text-xl font-sembiold">
                     {feature.title}
                   </h3>
                   <p className="text-muted-foreground">
                     {feature.description}
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </MaxWidthWrapper>
     </section>
     </>
  );
}


