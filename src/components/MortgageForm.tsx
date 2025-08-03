"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { MortgageDetails } from '@/lib/mortgageUtils'
import { DollarSign, Percent, Calendar, CreditCard } from 'lucide-react'

const mortgageSchema = z.object({
  balance: z.number().min(1000, 'Balance must be at least $1,000').max(10000000, 'Balance cannot exceed $10,000,000'),
  interestRate: z.number().min(0.1, 'Interest rate must be at least 0.1%').max(20, 'Interest rate cannot exceed 20%'),
  originalTerm: z.number().min(1, 'Term must be at least 1 year').max(50, 'Term cannot exceed 50 years'),
  monthlyPayment: z.number().min(100, 'Monthly payment must be at least $100').max(100000, 'Monthly payment cannot exceed $100,000')
})

type MortgageFormData = z.infer<typeof mortgageSchema>

interface MortgageFormProps {
  onSubmit: (details: MortgageDetails) => void
}

export function MortgageForm({ onSubmit }: MortgageFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<MortgageFormData>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: {
      balance: 0,
      interestRate: 0,
      originalTerm: 30,
      monthlyPayment: 0
    }
  })

  const formatCurrency = (value: string | number) => {
    const stringValue = String(value || '')
    const numericValue = stringValue.replace(/[^0-9]/g, '')
    return numericValue ? parseInt(numericValue).toLocaleString() : ''
  }

  const handleCurrencyInput = (field: 'balance' | 'monthlyPayment', value: string | number) => {
    const stringValue = String(value || '')
    const numericValue = parseInt(stringValue.replace(/[^0-9]/g, '')) || 0
    setValue(field, numericValue)
  }

  const onFormSubmit = async (data: MortgageFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mortgageDetails: MortgageDetails = {
        balance: data.balance,
        interestRate: data.interestRate,
        originalTerm: data.originalTerm,
        monthlyPayment: data.monthlyPayment,
        startDate: new Date()
      }
      
      onSubmit(mortgageDetails)
    } catch (error) {
      console.error('Error submitting mortgage details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Balance */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <Label htmlFor="balance" className="text-blue-800 font-medium">
                  Current Mortgage Balance
                </Label>
                <p className="text-sm text-blue-600">How much do you still owe?</p>
              </div>
            </div>
            <Input
              id="balance"
              type="text"
              placeholder="350,000"
              className="text-lg font-medium"
              {...register('balance', {
                setValueAs: (value) => parseInt(String(value || '').replace(/[^0-9]/g, '')) || 0
              })}
              onChange={(e) => {
                const formatted = formatCurrency(e.target.value)
                e.target.value = formatted
                handleCurrencyInput('balance', e.target.value)
              }}
            />
            {errors.balance && (
              <p className="text-red-500 text-sm mt-1">{errors.balance.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Interest Rate */}
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Percent className="h-5 w-5 text-white" />
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-green-800 font-medium">
                  Interest Rate
                </Label>
                <p className="text-sm text-green-600">Your current annual rate</p>
              </div>
            </div>
            <div className="relative">
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="3.75"
                className="text-lg font-medium pr-8"
                {...register('interestRate', { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            {errors.interestRate && (
              <p className="text-red-500 text-sm mt-1">{errors.interestRate.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Original Term */}
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <Label htmlFor="originalTerm" className="text-purple-800 font-medium">
                  Original Term
                </Label>
                <p className="text-sm text-purple-600">Length of your mortgage</p>
              </div>
            </div>
            <div className="relative">
              <Input
                id="originalTerm"
                type="number"
                placeholder="30"
                className="text-lg font-medium pr-16"
                {...register('originalTerm', { valueAsNumber: true })}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">years</span>
            </div>
            {errors.originalTerm && (
              <p className="text-red-500 text-sm mt-1">{errors.originalTerm.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Payment */}
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <Label htmlFor="monthlyPayment" className="text-orange-800 font-medium">
                  Monthly Payment
                </Label>
                <p className="text-sm text-orange-600">Principal + Interest only</p>
              </div>
            </div>
            <Input
              id="monthlyPayment"
              type="text"
              placeholder="1,850"
              className="text-lg font-medium"
              {...register('monthlyPayment', {
                setValueAs: (value) => parseInt(String(value || '').replace(/[^0-9]/g, '')) || 0
              })}
              onChange={(e) => {
                const formatted = formatCurrency(e.target.value)
                e.target.value = formatted
                handleCurrencyInput('monthlyPayment', e.target.value)
              }}
            />
            {errors.monthlyPayment && (
              <p className="text-red-500 text-sm mt-1">{errors.monthlyPayment.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700 mb-2">
          <strong>💡 Tip:</strong> You can find these details on your most recent mortgage statement or by logging into your lender's website.
        </p>
        <p className="text-xs text-blue-600">
          We only need your principal and interest payment - don't include taxes, insurance, or PMI.
        </p>
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Continue to Bank Connection'}
      </Button>
    </form>
  )
}
