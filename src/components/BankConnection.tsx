"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, AlertCircle, Loader2, Building2, Lock, Eye, UserCheck } from 'lucide-react'

interface BankConnectionProps {
  onConnect: () => void
}

export function BankConnection({ onConnect }: BankConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPlaidLink, setShowPlaidLink] = useState(false)

  const handlePlaidConnection = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Call our API to create a Plaid link token
      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create link token')
      }

      const { link_token } = await response.json()

      // In a real implementation, you would use Plaid Link here
      // For now, we'll simulate the connection process
      await simulatePlaidConnection(link_token)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect bank account')
    } finally {
      setIsConnecting(false)
    }
  }

  const simulatePlaidConnection = async (linkToken: string) => {
    // Simulate Plaid Link flow
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful connection
        if (Math.random() > 0.1) { // 90% success rate
          onConnect()
          resolve()
        } else {
          reject(new Error('Bank connection failed. Please try again.'))
        }
      }, 3000)
    })
  }

  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "256-bit encryption protects all your data"
    },
    {
      icon: Lock,
      title: "Never Store Credentials",
      description: "We never see or store your login information"
    },
    {
      icon: Eye,
      title: "Read-Only Access",
      description: "We can only view transactions, never move money"
    },
    {
      icon: UserCheck,
      title: "Trusted by Banks",
      description: "Used by over 11,000 financial institutions"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Security Assurance */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Bank Connection</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We use Plaid, the same technology trusted by Venmo, Robinhood, and thousands of other apps to securely connect your accounts.
        </p>
      </div>

      {/* Security Features Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {securityFeatures.map((feature, index) => (
          <Card key={index} className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-800 mb-1">{feature.title}</h4>
                  <p className="text-sm text-green-700">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Process */}
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-8 text-center">
          {!isConnecting ? (
            <div className="space-y-4">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to Connect</h4>
                <p className="text-gray-600 mb-6">
                  Click below to securely link your checking account and credit cards. This takes about 30 seconds.
                </p>
              </div>
              
              <Button 
                onClick={handlePlaidConnection}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3"
              >
                <Shield className="mr-2 h-5 w-5" />
                Connect with Plaid
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                By connecting your account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto animate-spin" />
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Connecting Your Account</h4>
                <p className="text-gray-600">
                  Please complete the authentication process in the popup window...
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  🔒 Your login credentials are encrypted and never stored on our servers
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* What We'll Access */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            What We'll Access
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Account balances and transaction history</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Spending patterns to identify surplus money</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Account details for ACH transfers</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>We will never:</strong> Store your login credentials, initiate transfers without your approval, or share your data with third parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
