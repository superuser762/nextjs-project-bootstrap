"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MortgageDetails, calculateMortgageStats, formatCurrency, formatDate } from '@/lib/mortgageUtils'
import { TrendingUp, Calendar, DollarSign, Target, ArrowRight } from 'lucide-react'

interface GoalSettingProps {
  mortgageDetails: MortgageDetails
  onComplete: () => void
}

export function GoalSetting({ mortgageDetails, onComplete }: GoalSettingProps) {
  const [extraPayment, setExtraPayment] = useState(100)
  const [stats, setStats] = useState(calculateMortgageStats(mortgageDetails, 0))
  const [optimizedStats, setOptimizedStats] = useState(calculateMortgageStats(mortgageDetails, extraPayment))

  useEffect(() => {
    setStats(calculateMortgageStats(mortgageDetails, 0))
    setOptimizedStats(calculateMortgageStats(mortgageDetails, extraPayment))
  }, [mortgageDetails, extraPayment])

  const scenarios = [
    { amount: 50, label: 'Conservative' },
    { amount: 100, label: 'Moderate' },
    { amount: 200, label: 'Aggressive' },
    { amount: 300, label: 'Maximum' }
  ]

  return (
    <div className="space-y-8">
      {/* Current Situation */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Current Mortgage</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{formatDate(stats.originalPayoffDate)}</div>
              <div className="text-sm text-red-600">Current Payoff Date</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{formatCurrency(stats.originalTotalInterest)}</div>
              <div className="text-sm text-orange-600">Total Interest Paid</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{mortgageDetails.originalTerm} years</div>
              <div className="text-sm text-gray-600">Original Term</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optimization Scenarios */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          See What Extra Payments Could Do
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Choose a monthly extra payment amount to see your potential savings:
        </p>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {scenarios.map((scenario) => {
            const scenarioStats = calculateMortgageStats(mortgageDetails, scenario.amount)
            const isSelected = extraPayment === scenario.amount
            
            return (
              <Card 
                key={scenario.amount}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
                    : 'hover:shadow-lg bg-white'
                }`}
                onClick={() => setExtraPayment(scenario.amount)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-center ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                    +{formatCurrency(scenario.amount)}/mo
                  </CardTitle>
                  <p className={`text-sm text-center ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                    {scenario.label}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center space-y-1">
                    <div className={`text-lg font-bold ${isSelected ? 'text-blue-800' : 'text-green-600'}`}>
                      {formatCurrency(scenarioStats.interestSaved)}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                      Interest Saved
                    </div>
                    <div className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {Math.round(scenarioStats.timeShaved / 12)} years faster
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Selected Scenario Results */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-800">
            Your Optimized Mortgage with +{formatCurrency(extraPayment)}/month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">
                {formatDate(optimizedStats.newPayoffDate)}
              </div>
              <div className="text-sm text-green-600">New Payoff Date</div>
              <div className="text-xs text-green-700 mt-1">
                {Math.round(optimizedStats.timeShaved / 12)} years, {optimizedStats.timeShaved % 12} months faster
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-800 mb-1">
                {formatCurrency(optimizedStats.interestSaved)}
              </div>
              <div className="text-sm text-emerald-600">Interest Saved</div>
              <div className="text-xs text-emerald-700 mt-1">
                {Math.round((optimizedStats.interestSaved / stats.originalTotalInterest) * 100)}% reduction
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-teal-800 mb-1">
                {formatCurrency(optimizedStats.newTotalInterest)}
              </div>
              <div className="text-sm text-teal-600">Total Interest</div>
              <div className="text-xs text-teal-700 mt-1">
                vs {formatCurrency(stats.originalTotalInterest)} original
              </div>
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="mt-8 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Interest Savings Progress</span>
                <span className="text-green-600 font-medium">
                  {Math.round((optimizedStats.interestSaved / stats.originalTotalInterest) * 100)}%
                </span>
              </div>
              <Progress 
                value={(optimizedStats.interestSaved / stats.originalTotalInterest) * 100} 
                className="h-3"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Time Reduction</span>
                <span className="text-blue-600 font-medium">
                  {Math.round((optimizedStats.timeShaved / (mortgageDetails.originalTerm * 12)) * 100)}%
                </span>
              </div>
              <Progress 
                value={(optimizedStats.timeShaved / (mortgageDetails.originalTerm * 12)) * 100} 
                className="h-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How We'll Find This Money */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-bold text-blue-900 mb-4 text-center">
            How We'll Help You Find {formatCurrency(extraPayment)} Every Month
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Round-Up Savings</div>
                  <div className="text-sm text-blue-600">~$30-50/month from spare change</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Budget Sweeps</div>
                  <div className="text-sm text-blue-600">~$40-80/month from leftover budgets</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Weekly Sweeps</div>
                  <div className="text-sm text-blue-600">~$20-40/month from account sweeps</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Windfall Allocation</div>
                  <div className="text-sm text-blue-600">Bonuses, refunds, and gifts</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={onComplete}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
        >
          Start Saving {formatCurrency(optimizedStats.interestSaved)}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          We'll help you find an extra {formatCurrency(extraPayment)} every month automatically
        </p>
      </div>
    </div>
  )
}
