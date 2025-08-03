"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MortgageForm } from '@/components/MortgageForm'
import { BankConnection } from '@/components/BankConnection'
import { GoalSetting } from '@/components/GoalSetting'
import { MortgageDetails } from '@/lib/mortgageUtils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type OnboardingStep = 'mortgage' | 'bank' | 'goals' | 'complete'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('mortgage')
  const [mortgageDetails, setMortgageDetails] = useState<MortgageDetails | null>(null)
  const [bankConnected, setBankConnected] = useState(false)

  const steps = [
    { id: 'mortgage', title: 'Mortgage Details', description: 'Tell us about your current mortgage' },
    { id: 'bank', title: 'Connect Bank', description: 'Securely link your accounts' },
    { id: 'goals', title: 'Set Goals', description: 'See your optimization potential' },
    { id: 'complete', title: 'Complete', description: 'You\'re all set!' }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleMortgageSubmit = (details: MortgageDetails) => {
    setMortgageDetails(details)
    setCurrentStep('bank')
  }

  const handleBankConnection = () => {
    setBankConnected(true)
    setCurrentStep('goals')
  }

  const handleGoalsComplete = () => {
    setCurrentStep('complete')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Quick Setup</h1>
            <p className="text-gray-600">Get started in just 5 minutes</p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStepIndex 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <div className="text-xs text-center mt-2 max-w-20">
                  <div className="font-medium">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 'mortgage' && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Your Mortgage Details</CardTitle>
                <CardDescription className="text-blue-100">
                  We'll use this information to calculate your optimization potential
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <MortgageForm onSubmit={handleMortgageSubmit} />
              </CardContent>
            </Card>
          )}

          {currentStep === 'bank' && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Connect Your Bank Account</CardTitle>
                <CardDescription className="text-green-100">
                  Securely link your accounts to start finding surplus money
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <BankConnection onConnect={handleBankConnection} />
              </CardContent>
            </Card>
          )}

          {currentStep === 'goals' && mortgageDetails && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Your Optimization Goals</CardTitle>
                <CardDescription className="text-purple-100">
                  See how much you could save with smart mortgage optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <GoalSetting 
                  mortgageDetails={mortgageDetails} 
                  onComplete={handleGoalsComplete}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 'complete' && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">🎉 You're All Set!</CardTitle>
                <CardDescription className="text-emerald-100">
                  Welcome to MortgageMax - let's start optimizing your mortgage
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="text-lg text-gray-700">
                    Your account is ready and your bank is connected. We'll start analyzing your spending patterns and identifying surplus money right away.
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">✓</div>
                      <div className="text-sm font-medium">Mortgage Connected</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">✓</div>
                      <div className="text-sm font-medium">Bank Linked</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">✓</div>
                      <div className="text-sm font-medium">Goals Set</div>
                    </div>
                  </div>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
