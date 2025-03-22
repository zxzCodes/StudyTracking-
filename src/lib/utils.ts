import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import { prisma } from "@/lib/db";
import { Goal } from "@prisma/client";


export async function calculateGoalProgress(goal: Goal) {
  const totalMinutes = await prisma.studySession.aggregate({
    where: {
      userId: goal.userId,
      languageId: goal.languageId,
      type: goal.activityType,
      archived: false,
      date: {
        ...(goal.deadline ? { lte: goal.deadline } : {}), // if there is a deadline, only count sessions before the deadline
      },
    },
    _sum: {
      duration: true,
    },
  });

  return totalMinutes._sum.duration ?? 0;
} // 



