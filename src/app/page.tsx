'use client';

import Link from 'next/link';
import { useUser } from '@stackframe/stack';
import { 
  Sparkles, 
  FileText, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Target
} from 'lucide-react';

export default function Home() {
  const user = useUser();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ProposalPilot</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard" className="btn-primary flex items-center gap-2">
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link href="/handler/sign-in" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium">
                    Sign In
                  </Link>
                  <Link href="/handler/sign-up" className="btn-primary">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Proposal Generation
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Create Winning Proposals
            <br />
            <span className="gradient-text">in 60 Seconds</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Paste your client's brief, and let AI craft a professional, compelling proposal. 
            Win more contracts without spending hours writing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={user ? "/dashboard/new" : "/handler/sign-up"} className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Generate Your First Proposal
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              See How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '60s', label: 'Average Generation Time' },
              { value: '3x', label: 'Faster Than Manual' },
              { value: '85%', label: 'User Win Rate Increase' },
              { value: '10k+', label: 'Proposals Generated' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Everything You Need to <span className="gradient-text">Win More Contracts</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'AI Brief Analysis',
                description: 'Our AI extracts key requirements, timelines, and budget hints from any client brief or RFP.',
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: 'Professional Templates',
                description: 'Choose from 5 industry-specific templates: Consulting, Development, Design, Marketing, or Construction.',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Smart Pricing',
                description: 'Get AI-suggested pricing based on scope complexity and market rates. Never undercharge again.',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Instant Export',
                description: 'Export to beautiful PDF or share via client portal. Professional formatting included.',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Win Rate Tracking',
                description: 'Track which proposals convert and learn what works for your specific niche.',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Your Data, Secured',
                description: 'Enterprise-grade security. Your proposals and client data are encrypted and never shared.',
              },
            ].map((feature, i) => (
              <div key={i} className="card card-hover p-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            3 Simple Steps to <span className="gradient-text">Better Proposals</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste the Brief',
                description: 'Copy and paste your client\'s email, RFP, or project description. Our AI handles the rest.',
              },
              {
                step: '02',
                title: 'Review & Customize',
                description: 'Edit the generated scope, adjust pricing, and add your personal touch with our visual editor.',
              },
              {
                step: '03',
                title: 'Send & Track',
                description: 'Export to PDF or share via link. Track when clients view and respond to your proposal.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-indigo-100 dark:text-indigo-900/50 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative z-10 pt-12">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['3 proposals/month', 'All templates', 'PDF export', 'Basic support'],
                cta: 'Start Free',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/month',
                features: ['Unlimited proposals', 'Custom branding', 'Win rate analytics', 'Priority support', 'Client portal'],
                cta: 'Go Pro',
                highlight: true,
              },
              {
                name: 'Agency',
                price: '$49',
                period: '/month',
                features: ['Everything in Pro', 'Team collaboration', 'API access', 'White-label export', 'Dedicated support'],
                cta: 'Contact Sales',
                highlight: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`card p-8 ${plan.highlight ? 'ring-2 ring-indigo-500 scale-105' : ''}`}>
                {plan.highlight && (
                  <div className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={user ? "/dashboard" : "/handler/sign-up"} 
                  className={plan.highlight ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Win More Contracts?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of freelancers and agencies who are closing deals faster with AI-powered proposals.
          </p>
          <Link href={user ? "/dashboard/new" : "/handler/sign-up"} className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Generate Your First Proposal — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">ProposalPilot</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              © 2026 ProposalPilot. Built with 🚀 during the 10-Day AI Challenge.
            </div>
            <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/privacy" className="hover:text-indigo-600">Privacy</Link>
              <Link href="/terms" className="hover:text-indigo-600">Terms</Link>
              <Link href="/security" className="hover:text-indigo-600">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
