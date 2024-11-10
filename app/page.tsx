'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"


const DAILY_QUESTIONS = [
  {
    id: 1,
    question: "Time invested in React today (in hours)?",
    key: "react_time"
  },
  {
    id: 2,
    question: "Time invested in React Native today (in hours)?",
    key: "react_native_time"
  },
  {
    id: 3,
    question: "Time spent on documentation?",
    key: "documentation_time"
  },
  {
    id: 4,
    question: "Number of components built today?",
    key: "components_built"
  }
]

export default function DailyChecklist() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [date, setDate] = useState<Date>(new Date())
  const { toast } = useToast()



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/daily-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          answers,
        }),
      })

      if (response.ok) {
        setAnswers({})
        toast({
          title: "Success!",
          description: "Your daily progress has been saved.",
          className: "top-0 right-0 bg-green-600 text-white",
          variant: 'default'

        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
        className: "top-0 right-0 ",
      })
    }
  }

  const isDateAllowed = (date: Date) => {
    return isToday(date) || isYesterday(date)
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Daily Developer Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    disabled={(date) => !isDateAllowed(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {DAILY_QUESTIONS.map((item) => (
              <div key={item.id} className="space-y-2">
                <Label htmlFor={item.key}>{item.question}</Label>
                <Input
                  id={item.key}
                  type="text"
                  value={answers[item.key] || ''}
                  onChange={(e) =>
                    setAnswers(prev => ({
                      ...prev,
                      [item.key]: e.target.value
                    }))
                  }
                  placeholder="Enter your answer"
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              Save Daily Progress
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
