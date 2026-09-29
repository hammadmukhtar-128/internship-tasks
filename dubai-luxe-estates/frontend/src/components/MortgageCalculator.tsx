"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/api";

export default function MortgageCalculator({ price }: { price: number }) {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  const monthly = useMemo(() => {
    const principal = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  }, [price, downPayment, rate, years]);

  return (
    <div className="card-luxury mt-10 p-6">
      <h2 className="font-display text-2xl font-semibold text-ink">Mortgage Calculator</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-ink/50">Down Payment (PKR)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-ink/50">Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-ink/50">Term (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-ivory p-6 text-center">
        <p className="text-xs uppercase tracking-wider text-ink/50">Estimated Monthly Payment</p>
        <p className="mt-2 font-display text-3xl font-bold text-gold-dark">{formatPrice(Math.round(monthly))}</p>
        <p className="mt-2 text-xs text-ink/40">Estimate only. Not a loan offer.</p>
      </div>
    </div>
  );
}
