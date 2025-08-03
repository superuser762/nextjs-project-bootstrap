export interface MortgageDetails {
  balance: number;
  interestRate: number;
  originalTerm: number;
  monthlyPayment: number;
  startDate?: Date;
}

export interface MortgageStats {
  originalPayoffDate: Date;
  originalTotalInterest: number;
  newPayoffDate: Date;
  newTotalInterest: number;
  interestSaved: number;
  timeShaved: number; // in months
  totalPayments: number;
}

export function calculateMortgageStats(
  mortgage: MortgageDetails,
  extraMonthlyPayment: number = 0
): MortgageStats {
  try {
    const { balance, interestRate, originalTerm, monthlyPayment } = mortgage;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = originalTerm * 12;
    
    // Calculate original payoff scenario
    const originalPayoffDate = new Date();
    originalPayoffDate.setMonth(originalPayoffDate.getMonth() + totalMonths);
    
    const originalTotalInterest = (monthlyPayment * totalMonths) - balance;
    
    // Calculate accelerated payoff scenario
    let remainingBalance = balance;
    let month = 0;
    let totalInterestPaid = 0;
    const newMonthlyPayment = monthlyPayment + extraMonthlyPayment;
    
    while (remainingBalance > 0 && month < totalMonths) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(newMonthlyPayment - interestPayment, remainingBalance);
      
      totalInterestPaid += interestPayment;
      remainingBalance -= principalPayment;
      month++;
      
      if (remainingBalance <= 0) break;
    }
    
    const newPayoffDate = new Date();
    newPayoffDate.setMonth(newPayoffDate.getMonth() + month);
    
    const interestSaved = originalTotalInterest - totalInterestPaid;
    const timeShaved = totalMonths - month;
    
    return {
      originalPayoffDate,
      originalTotalInterest,
      newPayoffDate,
      newTotalInterest: totalInterestPaid,
      interestSaved,
      timeShaved,
      totalPayments: month
    };
  } catch (error) {
    console.error('Error calculating mortgage stats:', error);
    throw new Error('Failed to calculate mortgage statistics');
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateRoundUpSavings(transactions: Array<{ amount: number }>): number {
  return transactions.reduce((total, transaction) => {
    const roundUp = Math.ceil(transaction.amount) - transaction.amount;
    return total + roundUp;
  }, 0);
}

export function generateAmortizationSchedule(
  mortgage: MortgageDetails,
  extraPayment: number = 0
): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> {
  const schedule = [];
  const monthlyRate = mortgage.interestRate / 100 / 12;
  let balance = mortgage.balance;
  let month = 1;
  
  while (balance > 0 && month <= mortgage.originalTerm * 12) {
    const interestPayment = balance * monthlyRate;
    const totalPayment = mortgage.monthlyPayment + extraPayment;
    const principalPayment = Math.min(totalPayment - interestPayment, balance);
    
    balance -= principalPayment;
    
    schedule.push({
      month,
      payment: totalPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance)
    });
    
    month++;
    if (balance <= 0) break;
  }
  
  return schedule;
}
