"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { VisualizationDashboard } from '@/components/VisualizationDashboard'
import { SurplusMethods } from '@/components/SurplusMethods'
import { PaymentControl } from '@/components/PaymentControl'
import { EducationalContent } from '@/components/EducationalContent'
import { MortgageDetails } from '@/lib/mortgageUtils'
import { Settings, User, Bell, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const [mortgageDetails, setMortgageDetails] = useState<MortgageDetails>({
    balance: 350000,
    interestRate: 3.75,
    originalTerm: 30,
    monthlyPayment: 1850,
    startDate: new Date()
  })

  const [surplusBalance, setSurplusBalance] = useState(247.50)
  const [totalSaved, setTotalSaved] = useState(1250)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MortgageMax
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's how your mortgage optimization is performing.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">${surplusBalance.toFixed(2)}</div>
              <div className="text-green-100">Surplus This Month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">${totalSaved.toLocaleString()}</div>
              <div className="text-blue-100">Total Interest Saved</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">8 months</div>
              <div className="text-purple-100">Time Shaved Off</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="text-2xl font-bold">$67,000</div>
              <div className="text-orange-100">Projected Savings</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="surplus">Surplus Methods</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <VisualizationDashboard 
              mortgageDetails={mortgageDetails}
              extraPayment={100}
            />
          </TabsContent>

          <TabsContent value="surplus" className="space-y-6">
            <SurplusMethods />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentControl 
              surplusBalance={surplusBalance}
              onTransfer={(amount: number) => {
                setSurplusBalance(prev => prev - amount)
                setTotalSaved(prev => prev + amount)
              }}
            />
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <EducationalContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
