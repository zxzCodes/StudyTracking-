"use client";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";
import { formatMinutes } from "@/lib/time";

import {toast}  from 'sonner'
import { deleteGoal } from "@/app/actions/goals";
import { GoalWithLanguage } from "../../../types/dashboard";
import { Progress } from "../ui/progress";

interface GoalsOverviewProps {
  goals: GoalWithLanguage[];
}

const GoalsOverview = ({ goals }: GoalsOverviewProps) => {
  

  async function handleDelete(goalId: string) {
    const result = await deleteGoal(goalId);

    if (result.error) {
      toast.error('Error deleting goal');
    } else {
      toast.success('Goal deleted');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
          <p className="text-muted-foreground">
            Track your progress towards your language learning goals.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals?.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No goals yet.</p>
            <p>Add a goal to get started.</p>
          </div>
        )}

        {goals?.map((goal) => {
          return (
            <div
              key={goal.id}
              className="rounded-xl border bg-card text-card-foreground shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{goal.language.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {goal.activityType?.charAt(0) +
                        goal.activityType?.slice(1).toLowerCase()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      handleDelete(goal.id);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>
                      {formatMinutes(goal.progress)} /{" "}
                      {formatMinutes(goal.target)}
                    </span>
                  </div>
                  <Progress
                    value={(goal.progress / goal.target) * 100}
                    className="h-2"
                  />
                </div>
                {goal.deadline && (
                  <p className="text-sm text-muted-foreground">
                    Due by {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsOverview;