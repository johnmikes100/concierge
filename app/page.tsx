"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { format, startOfToday, parseISO } from "date-fns"

type Answers = {
  occasion: string
  peopleCount: string
  preferredDate: string
  budget: string
  vibe: string
  roomType: string
  amenities: string[]
  companyName: string
  fullName: string
  phoneNumber: string
  email: string
}

const questions = [
  {
    id: "occasion",
    question: "What's the occasion?",
    type: "text" as const,
  },
  {
    id: "peopleCount",
    question: "Roughly how many people are you expecting?",
    type: "text" as const,
  },
  {
    id: "preferredDate",
    question: "What's your preferred date?",
    type: "calendar" as const,
  },
  {
    id: "budget",
    question: "What is the estimated total budget?",
    type: "text" as const,
  },
  {
    id: "vibe",
    question: 'What "Vibe" are you looking for?',
    type: "text" as const,
  },
  {
    id: "roomType",
    question: 'Do you need a private room, or is a reserved "section" okay?',
    type: "radio" as const,
    options: ["Private room", "Reserved section is fine", "No preference for now"],
  },
  {
    id: "amenities",
    question: 'Any "Must-Have" amenities?',
    type: "checkbox" as const,
    options: ["Wi-Fi", "AV Equipment", "Outdoor Space", "Parking", "Accessible", "Other"],
  },
  {
    id: "companyName",
    question: "What is the name of your company?",
    type: "text" as const,
  },
  {
    id: "fullName",
    question: "Full name",
    type: "text" as const,
  },
  {
    id: "phoneNumber",
    question: "Phone number",
    type: "tel" as const,
  },
  {
    id: "email",
    question: "Email address",
    subtext: "We will personally send you our suggestions ;)",
    type: "email" as const,
  },
]

export default function HomePage() {
  const [showSurvey, setShowSurvey] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousStep, setPreviousStep] = useState(-1)
  const [answers, setAnswers] = useState<Answers>({
    occasion: "",
    peopleCount: "",
    preferredDate: "",
    budget: "",
    vibe: "",
    roomType: "",
    amenities: [],
    companyName: "",
    phoneNumber: "",
    fullName: "",
    email: "",
  })
  const [direction, setDirection] = useState<"forward" | "back">("forward")

  const currentQuestion = questions[currentStep]
  const isLastQuestion = currentStep === questions.length - 1
  const canGoBack = currentStep > 0

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setDirection("forward")
      setPreviousStep(currentStep)
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 0)
      setTimeout(() => {
        setIsTransitioning(false)
        setPreviousStep(-1)
      }, 500)
    } else {
      // Submit the form
      setIsSubmitting(true)
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        })
        if (response.ok) {
          setIsSubmitted(true)
        } else {
          alert("Something went wrong. Please try again.")
        }
      } catch (error) {
        alert("Something went wrong. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (canGoBack) {
      setDirection("back")
      setPreviousStep(currentStep)
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
      }, 0)
      setTimeout(() => {
        setIsTransitioning(false)
        setPreviousStep(-1)
      }, 500)
    }
  }

  const handleTextChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
  }

  const handleRadioChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
  }

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentAmenities = answers.amenities || []
    const newAmenities = checked ? [...currentAmenities, option] : currentAmenities.filter((a) => a !== option)
    setAnswers({ ...answers, amenities: newAmenities })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setAnswers({ ...answers, preferredDate: format(date, "yyyy-MM-dd") })
    }
  }

  const getCurrentValue = () => {
    return answers[currentQuestion.id as keyof Answers]
  }

  const isAnswered = () => {
    const value = getCurrentValue()
    if (currentQuestion.type === "checkbox") {
      return Array.isArray(value) && value.length > 0
    }
    return value && value.toString().trim() !== ""
  }

  const renderQuestion = (step: number) => {
    const question = questions[step]
    const value = answers[question.id as keyof Answers]

    return (
      <>
        <div className="h-9 mb-8">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isTransitioning}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">{question.question}</h2>
        {"subtext" in question && question.subtext && (
          <p className="text-muted-foreground mb-6">{question.subtext}</p>
        )}
        {!("subtext" in question) && <div className="mb-6" />}

        <div className="space-y-4">
          {question.type === "text" || question.type === "email" || question.type === "tel" ? (
            <Input
              type={question.type}
              value={value as string}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your answer here..."
              className="text-lg p-6 border-2 focus-visible:ring-offset-0"
              autoFocus={step === currentStep}
              disabled={isTransitioning}
            />
          ) : question.type === "calendar" ? (
            <div className="flex flex-col items-start gap-4">
              <RadioGroup 
                value={value === "not-sure-yet" ? "not-sure-yet" : ""} 
                onValueChange={(val) => {
                  if (val === "not-sure-yet") {
                    setAnswers({ ...answers, preferredDate: "not-sure-yet" })
                  }
                }} 
                disabled={isTransitioning}
                className="w-full"
              >
                <div
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-foreground transition-colors cursor-pointer"
                  onClick={() => {
                    if (isTransitioning) return
                    setAnswers({ ...answers, preferredDate: "not-sure-yet" })
                  }}
                >
                  <RadioGroupItem value="not-sure-yet" id={`${step}-not-sure-yet`} />
                  <Label htmlFor={`${step}-not-sure-yet`} className="text-lg cursor-pointer flex-1">
                    Not sure yet
                  </Label>
                </div>
              </RadioGroup>
              <Calendar
                mode="single"
                selected={value && value !== "not-sure-yet" ? parseISO(value as string) : undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < startOfToday()}
                className="rounded-lg border-2 border-border"
              />
              {value && value !== "not-sure-yet" && (
                <p className="text-lg text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{format(parseISO(value as string), "MMMM d, yyyy")}</span>
                </p>
              )}
            </div>
          ) : question.type === "radio" ? (
            <RadioGroup value={value as string} onValueChange={handleRadioChange} disabled={isTransitioning}>
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-foreground transition-colors cursor-pointer"
                    onClick={() => !isTransitioning && handleRadioChange(option)}
                  >
                    <RadioGroupItem value={option} id={`${step}-${option}`} />
                    <Label htmlFor={`${step}-${option}`} className="text-lg cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : question.type === "checkbox" ? (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-foreground transition-colors cursor-pointer"
                  onClick={() => {
                    if (isTransitioning) return
                    const currentAmenities = (answers.amenities || []) as string[]
                    const isChecked = currentAmenities.includes(option)
                    handleCheckboxChange(option, !isChecked)
                  }}
                >
                  <Checkbox
                    id={`${step}-${option}`}
                    checked={(answers.amenities || []).includes(option)}
                    onCheckedChange={(checked) => !isTransitioning && handleCheckboxChange(option, checked as boolean)}
                    disabled={isTransitioning}
                  />
                  <Label htmlFor={`${step}-${option}`} className="text-lg cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <Button onClick={handleNext} disabled={!isAnswered() || isTransitioning || isSubmitting} size="lg" className="text-lg px-8">
            {isSubmitting ? "Submitting..." : step === questions.length - 1 ? "Submit" : "OK"}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Press <span className="font-semibold">Enter ↵</span>
          </p>
        </div>
      </>
    )
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && isAnswered() && !isTransitioning) {
      handleNext()
    }
  }

  useEffect(() => {
    if (showSurvey) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [showSurvey, currentStep, isTransitioning, answers])

  if (!showSurvey) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-xl">
          <div className="space-y-1">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Concierge</h1>
            <p className="text-xs text-muted-foreground">powered by Happy Hour SF</p>
          </div>
          <p className="text-lg text-muted-foreground">
            We've hand-picked the best spots in San Francisco for team events. Tell us what you need, and we'll handle
            the rest.
          </p>
          <Button onClick={() => setShowSurvey(true)} className="px-8 py-2">
            Start
          </Button>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-xl">
          <div className="space-y-1">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Thank you!</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            We've received your request and sent a confirmation to your email. You can expect a curated set of venue options shortly.
          </p>
          <p className="text-xs text-muted-foreground">powered by Happy Hour SF</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Concierge</h1>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1} / {questions.length}
        </span>
      </header>

      <main className="flex-1 flex pt-12 p-6 overflow-hidden relative">
        <div className="w-full max-w-2xl mx-auto">
          {isTransitioning && previousStep >= 0 && (
            <div
              className="absolute inset-0 px-6"
              style={{
                transform: direction === "forward" ? "translateX(-100%)" : "translateX(100%)",
                opacity: 0,
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div className="w-full max-w-2xl mx-auto">{renderQuestion(previousStep)}</div>
            </div>
          )}

          <div
            style={{
              transform: isTransitioning ? "translateX(0)" : "translateX(0)",
              opacity: isTransitioning ? 1 : 1,
              transition: isTransitioning
                ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
            }}
            className={
              isTransitioning
                ? direction === "forward"
                  ? "animate-in slide-in-from-right fade-in duration-500"
                  : "animate-in slide-in-from-left fade-in duration-500"
                : ""
            }
          >
            {renderQuestion(currentStep)}
          </div>
        </div>
      </main>

      <footer className="p-6 text-center">
        <p className="text-xs text-muted-foreground">powered by Happy Hour San Francisco</p>
      </footer>
    </div>
  )
}
