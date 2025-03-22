"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { ActivityType } from "@prisma/client"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { convertToMinutes } from "@/lib/time"
import { createGoal } from "@/app/actions/goals"
import { type GoalInput, goalSchema } from "@/lib/schema/goal"

interface AddGoalFormProps {
  languages: {
    id: string
    name: string
  }[]
}

const AddGoalForm = ({ languages }: AddGoalFormProps) => {
  const form = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      languageId: "",
      hours: 0,
      minutes: 0,
      deadline: null,
      activityType: ActivityType.READING,
    },
    mode: "onSubmit",
  })

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: GoalInput) => {
    try {
      setIsLoading(true)

      const target = convertToMinutes(data.hours, data.minutes)
      const result = await createGoal({
        languageId: data.languageId,
        target,
        deadline: data.deadline,
        activityType: data.activityType,
      })

      if (result.error) {
        toast.error("An error occurred while creating the goal. Please try again later")
        return
      }

      toast.success("Goal created successfully")
      router.push("/dashboard/goals")
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while creating the goal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="languageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={5000}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minutes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="activityType"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Activity Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an activity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ActivityType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"
        disabled={isLoading}
        className="w-full mt-4">
          {isLoading ? (
            <>
              <Loader2 /> Creating goal
            </>
          ) : (
            "Create Goal"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default AddGoalForm

