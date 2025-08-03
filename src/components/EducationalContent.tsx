"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calculator, TrendingUp, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react'

export function EducationalContent() {
  const [completedArticles, setCompletedArticles] = useState<string[]>(['amortization'])

  const articles = [
    {
      id: 'amortization',
      title: 'Understanding Amortization',
      description: 'Learn how your mortgage payments are split between principal and interest',
      readTime: '3 min read',
      category: 'Basics',
      content: {
        summary: 'Amortization is the process of paying off your mortgage through regular payments over time.',
        keyPoints: [
          'Early payments are mostly interest, later payments are mostly principal',
          'Each payment reduces your principal balance slightly',
          'Interest is calculated on the remaining balance each month',
          'Extra principal payments can dramatically reduce total interest paid'
        ],
        example: 'On a $300,000 mortgage at 4% interest, your first payment of $1,432 includes $1,000 in interest and only $432 in principal.'
      }
    },
    {
      id: 'principal-vs-interest',
      title: 'Principal vs Interest Payments',
      description: 'Understand the difference and why it matters for optimization',
      readTime: '4 min read',
      category: 'Basics',
      content: {
        summary: 'Every mortgage payment consists of two parts: principal (paying down the loan) and interest (the cost of borrowing).',
        keyPoints: [
          'Principal payments reduce your loan balance',
          'Interest payments are the cost of borrowing money',
          'The ratio changes over time - more interest early, more principal later',
          'Extra principal payments save interest on future payments'
        ],
        example: 'If you pay an extra $100 toward principal, you save all the interest that would have been charged on that $100 for the remaining loan term.'
      }
    },
    {
      id: 'extra-payments-impact',
      title: 'The Power of Extra Payments',
      description: 'See how small extra payments create massive savings',
      readTime: '5 min read',
      category: 'Strategy',
      content: {
        summary: 'Even small extra payments toward your mortgage principal can save tens of thousands in interest and years off your loan.',
        keyPoints: [
          'Extra payments go directly toward principal reduction',
          'Each extra dollar saves interest for the entire remaining loan term',
          'Earlier extra payments have more impact than later ones',
          'Consistency matters more than large occasional payments'
        ],
        example: 'Adding just $50/month to a $300,000 mortgage can save over $23,000 in interest and 2.5 years of payments.'
      }
    },
    {
      id: 'surplus-strategies',
      title: 'Finding Surplus Money',
      description: 'Discover money you didn\'t know you had for mortgage payments',
      readTime: '6 min read',
      category: 'Strategy',
      content: {
        summary: 'Most people have surplus money in their budget that can be redirected toward mortgage payments without affecting their lifestyle.',
        keyPoints: [
          'Round-ups from purchases add up quickly over time',
          'Budget leftovers are often forgotten money',
          'Automatic sweeps capture money that would otherwise be spent',
          'Windfalls like tax refunds can make huge impacts'
        ],
        example: 'The average person generates $150-250 per month in surplus through round-ups, budget sweeps, and automatic transfers.'
      }
    },
    {
      id: 'mortgage-math',
      title: 'The Math Behind Mortgage Optimization',
      description: 'Deep dive into the calculations that drive your savings',
      readTime: '8 min read',
      category: 'Advanced',
      content: {
        summary: 'Understanding the mathematical principles behind mortgage optimization helps you make informed decisions about extra payments.',
        keyPoints: [
          'Interest is calculated monthly on the remaining balance',
          'Extra principal payments reduce future interest calculations',
          'The time value of money affects when to make extra payments',
          'Compound savings grow exponentially over time'
        ],
        example: 'A $1,000 extra payment in year 1 saves more interest than the same payment in year 15, due to the longer time period affected.'
      }
    },
    {
      id: 'tax-implications',
      title: 'Tax Considerations',
      description: 'How mortgage optimization affects your tax situation',
      readTime: '4 min read',
      category: 'Advanced',
      content: {
        summary: 'Paying off your mortgage faster reduces your mortgage interest deduction, but the overall financial benefit usually outweighs the tax cost.',
        keyPoints: [
          'Mortgage interest is tax-deductible up to certain limits',
          'Faster payoff means less deductible interest over time',
          'The interest saved usually exceeds the tax benefit lost',
          'Consider your tax bracket when making decisions'
        ],
        example: 'Even if you lose a $2,000 annual tax deduction, saving $5,000 in interest still nets you $3,000 in benefit.'
      }
    }
  ]

  const categories = ['All', 'Basics', 'Strategy', 'Advanced']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  const markAsCompleted = (articleId: string) => {
    if (!completedArticles.includes(articleId)) {
      setCompletedArticles([...completedArticles, articleId])
    }
  }

  const completionPercentage = (completedArticles.length / articles.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Learning Progress</h3>
              <p className="text-gray-600">Master mortgage optimization concepts</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {completedArticles.length}/{articles.length}
              </div>
              <div className="text-sm text-gray-600">Articles completed</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            {Math.round(completionPercentage)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => {
          const isCompleted = completedArticles.includes(article.id)
          
          return (
            <Card key={article.id} className={`transition-all hover:shadow-lg ${
              isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <CardTitle className={`text-lg ${
                      isCompleted ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {article.title}
                    </CardTitle>
                    <CardDescription className={
                      isCompleted ? 'text-green-600' : 'text-gray-600'
                    }>
                      {article.description}
                    </CardDescription>
                  </div>
                  <BookOpen className={`h-5 w-5 ${
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="space-y-3">
                    <p className="text-sm text-gray-700">
                      {article.content.summary}
                    </p>
                    {!isCompleted && (
                      <Button 
                        size="sm" 
                        onClick={() => markAsCompleted(article.id)}
                        className="w-full"
                      >
                        Mark as Read
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
                      <ul className="space-y-1">
                        {article.content.keyPoints.map((point, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-1">Example:</h4>
                      <p className="text-sm text-blue-700">{article.content.example}</p>
                    </div>
                    
                    {!isCompleted && (
                      <Button 
                        size="sm" 
                        onClick={() => markAsCompleted(article.id)}
                        className="w-full"
                      >
                        Mark as Read
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-800">💡 Start Small</h4>
              <p className="text-sm text-yellow-700">
                Even $25 extra per month makes a difference. Build the habit first, then increase the amount.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-800">📅 Be Consistent</h4>
              <p className="text-sm text-yellow-700">
                Regular small payments beat occasional large ones. Automation is your friend.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-800">🎯 Target Principal</h4>
              <p className="text-sm text-yellow-700">
                Always specify "principal only" when making extra payments to maximize impact.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-800">📊 Track Progress</h4>
              <p className="text-sm text-yellow-700">
                Monitor your payoff date and interest savings to stay motivated.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Quick Impact Calculator
          </CardTitle>
          <CardDescription>
            See the impact of different extra payment amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$50/month</div>
              <div className="text-sm text-green-700 mt-1">
                Saves ~$23,000<br />
                2.5 years faster
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$100/month</div>
              <div className="text-sm text-blue-700 mt-1">
                Saves ~$42,000<br />
                4.5 years faster
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$200/month</div>
              <div className="text-sm text-purple-700 mt-1">
                Saves ~$75,000<br />
                7.5 years faster
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center mt-4">
            *Based on a $300,000 mortgage at 4% interest rate
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
