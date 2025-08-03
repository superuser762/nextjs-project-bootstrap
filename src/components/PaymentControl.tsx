"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { PiggyBank, Send, Shield, CheckCircle, AlertCircle, Clock, DollarSign, Target } from 'lucide-react'

interface PaymentControlProps {
  surplusBalance: number
  onTransfer: (amount: number) => void
}

export function PaymentControl({ surplusBalance, onTransfer }: PaymentControlProps) {
  const [transferThreshold, setTransferThreshold] = useState(100)
  const [isTransferring, setIsTransferring] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [pendingTransferAmount, setPendingTransferAmount] = useState(0)
  const [transferHistory, setTransferHistory] = useState([
    { date: '2024-03-15', amount: 125.50, status: 'completed', type: 'automatic' },
    { date: '2024-03-01', amount: 100.00, status: 'completed', type: 'manual' },
    { date: '2024-02-15', amount: 150.75, status: 'completed', type: 'automatic' },
    { date: '2024-02-01', amount: 89.25, status: 'completed', type: 'windfall' }
  ])

  const handleTransferRequest = (amount: number) => {
    setPendingTransferAmount(amount)
    setShowApprovalDialog(true)
  }

  const handleApproveTransfer = async () => {
    setIsTransferring(true)
    setShowApprovalDialog(false)

    try {
      // Simulate API call to initiate ACH transfer
      const response = await fetch('/api/payment/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: pendingTransferAmount,
          type: 'principal_only'
        })
      })

      if (!response.ok) {
        throw new Error('Transfer failed')
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update local state
      onTransfer(pendingTransferAmount)
      
      // Add to transfer history
      const newTransfer = {
        date: new Date().toISOString().split('T')[0],
        amount: pendingTransferAmount,
        status: 'completed' as const,
        type: 'manual' as const
      }
      setTransferHistory(prev => [newTransfer, ...prev])

    } catch (error) {
      console.error('Transfer error:', error)
      // Handle error (show error message)
    } finally {
      setIsTransferring(false)
      setPendingTransferAmount(0)
    }
  }

  const progressPercentage = (surplusBalance / transferThreshold) * 100

  return (
    <div className="space-y-6">
      {/* Holding Pot Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-green-600" />
            Your Mortgage Surplus Pot
          </CardTitle>
          <CardDescription>
            Money identified and ready for your next mortgage payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">
              ${surplusBalance.toFixed(2)}
            </div>
            <p className="text-green-700">Available for transfer</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress to next transfer</span>
              <span className="font-medium">
                ${surplusBalance.toFixed(2)} / ${transferThreshold}
              </span>
            </div>
            <Progress value={Math.min(progressPercentage, 100)} className="h-3" />
            <p className="text-xs text-gray-600 text-center">
              {surplusBalance >= transferThreshold 
                ? "Ready for transfer!" 
                : `$${(transferThreshold - surplusBalance).toFixed(2)} more needed`
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => handleTransferRequest(surplusBalance)}
              disabled={surplusBalance < 25 || isTransferring}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Transfer Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleTransferRequest(transferThreshold)}
              disabled={surplusBalance < transferThreshold || isTransferring}
            >
              <Target className="mr-2 h-4 w-4" />
              Auto Transfer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Settings</CardTitle>
          <CardDescription>
            Configure when and how your surplus money gets transferred
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="threshold">Auto-Transfer Threshold</Label>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <Input
                  id="threshold"
                  type="number"
                  value={transferThreshold}
                  onChange={(e) => setTransferThreshold(Number(e.target.value))}
                  min="25"
                  max="1000"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Automatically transfer when pot reaches this amount
              </p>
            </div>

            <div>
              <Label>Transfer Frequency</Label>
              <div className="mt-1">
                <select className="w-full p-2 border rounded-md">
                  <option>When threshold is reached</option>
                  <option>Weekly (if minimum $25)</option>
                  <option>Monthly</option>
                  <option>Manual only</option>
                </select>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                How often to check for transfers
              </p>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All transfers require your approval and are sent directly to your mortgage lender as principal-only payments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>
            Your recent mortgage payments and their impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transferHistory.map((transfer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transfer.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {transfer.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Clock className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">${transfer.amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{transfer.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={transfer.status === 'completed' ? 'default' : 'secondary'}>
                    {transfer.status}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1 capitalize">
                    {transfer.type}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-800">Total Transferred This Year</span>
              <span className="text-2xl font-bold text-blue-600">
                ${transferHistory.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Estimated interest saved: ${(transferHistory.reduce((sum, t) => sum + t.amount, 0) * 0.85).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Approve Transfer
            </DialogTitle>
            <DialogDescription>
              You're about to send ${pendingTransferAmount.toFixed(2)} to your mortgage lender as a principal-only payment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Transfer Details</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">${pendingTransferAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">Principal Only</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Impact</h4>
              <div className="space-y-1 text-sm text-green-700">
                <div>• Reduces principal balance immediately</div>
                <div>• Saves approximately ${(pendingTransferAmount * 0.85).toFixed(2)} in interest</div>
                <div>• Shortens mortgage term by ~2 weeks</div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowApprovalDialog(false)}
              disabled={isTransferring}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApproveTransfer}
              disabled={isTransferring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isTransferring ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Transfer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
