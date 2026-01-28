'use client';

import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  Sparkles, 
  Loader2,
  Briefcase,
  Code,
  Palette,
  Megaphone,
  HardHat
} from 'lucide-react';

const templates = [
  { id: 'consulting', name: 'Consulting', icon: <Briefcase className="w-6 h-6" />, description: 'Strategy, advisory, and business services' },
  { id: 'development', name: 'Development', icon: <Code className="w-6 h-6" />, description: 'Software, web, and mobile development' },
  { id: 'design', name: 'Design', icon: <Palette className="w-6 h-6" />, description: 'Brand, UX/UI, and creative design' },
  { id: 'marketing', name: 'Marketing', icon: <Megaphone className="w-6 h-6" />, description: 'Campaigns, content, and growth' },
  { id: 'construction', name: 'Construction', icon: <HardHat className="w-6 h-6" />, description: 'Building, renovation, and contracting' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export default function NewProposal() {
  const user = useUser();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('consulting');
  const [currency, setCurrency] = useState('USD');
  const [brief, setBrief] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user === null) {
      router.push('/handler/sign-in');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  async function handleGenerate() {
    if (!brief.trim()) {
      setError('Please enter the client brief');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, template, currency }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate proposal');
      }

      const data = await res.json();
      router.push(`/dashboard/proposal/${data.id}`);
    } catch (err) {
      setError('Failed to generate proposal. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">New Proposal</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              }`}>
                {s}
              </div>
              <span className={step >= s ? 'font-medium' : 'text-slate-500'}>
                {s === 1 ? 'Choose Template' : 'Enter Brief'}
              </span>
              {s === 1 && <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Template Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">What type of proposal?</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Choose a template that best matches your service.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`card p-4 text-left transition-all ${
                    template === t.id 
                      ? 'ring-2 ring-indigo-500 border-indigo-500' 
                      : 'hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      template === t.id 
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                      {t.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Currency */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Currency</label>
              <div className="flex gap-2">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currency === c.code
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary w-full sm:w-auto"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Brief Input */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">Paste the client brief</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Copy the client's email, RFP, or project description. Our AI will extract requirements and create a professional proposal.
            </p>

            <div className="card p-6 mb-6">
              <label className="block text-sm font-medium mb-2">Client Brief / RFP</label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={`Example:\n\nHi, we're looking for a developer to build our new e-commerce website. We need:\n- Product catalog with filters\n- Shopping cart and checkout\n- Payment integration (Stripe)\n- Admin dashboard\n\nBudget is around $10-15k and we'd like to launch in 2 months.\n\nBest,\nJohn from TechCorp`}
                className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
              <div className="flex justify-between mt-2 text-sm text-slate-500">
                <span>Minimum 50 characters</span>
                <span>{brief.length} characters</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || brief.length < 50}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Proposal
                  </>
                )}
              </button>
            </div>

            {generating && (
              <div className="mt-8 card p-6 text-center animate-pulse-glow">
                <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI is analyzing your brief...</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Extracting requirements, calculating scope, and crafting your proposal.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
