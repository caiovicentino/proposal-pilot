'use client';

import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Loader2
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientCompany: string;
  status: string;
  pricing: { total: number; currency: string };
  createdAt: string;
  template: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  DRAFT: { icon: <Clock className="w-4 h-4" />, color: 'text-slate-600', bg: 'bg-slate-100' },
  SENT: { icon: <Eye className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-100' },
  VIEWED: { icon: <Eye className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-100' },
  ACCEPTED: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-100' },
  REJECTED: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-100' },
  EXPIRED: { icon: <Clock className="w-4 h-4" />, color: 'text-orange-600', bg: 'bg-orange-100' },
};

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push('/handler/sign-in');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchProposals();
    }
  }, [user]);

  async function fetchProposals() {
    try {
      const res = await fetch('/api/proposals');
      if (res.ok) {
        const data = await res.json();
        setProposals(data);
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'DRAFT').length,
    sent: proposals.filter(p => ['SENT', 'VIEWED'].includes(p.status)).length,
    won: proposals.filter(p => p.status === 'ACCEPTED').length,
    totalValue: proposals.reduce((acc, p) => acc + (p.pricing?.total || 0), 0),
  };

  const winRate = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ProposalPilot</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {user.displayName || user.primaryEmail}
              </span>
              <button 
                onClick={() => user.signOut()}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & New Proposal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.displayName?.split(' ')[0] || 'there'}!</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your proposals and track your wins.</p>
          </div>
          <Link href="/dashboard/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Proposal
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Proposals', value: stats.total, icon: <FileText className="w-5 h-5" /> },
            { label: 'Drafts', value: stats.draft, icon: <Clock className="w-5 h-5" /> },
            { label: 'Sent', value: stats.sent, icon: <Eye className="w-5 h-5" /> },
            { label: 'Won', value: stats.won, icon: <CheckCircle className="w-5 h-5" /> },
            { label: 'Win Rate', value: `${winRate}%`, icon: <TrendingUp className="w-5 h-5" /> },
          ].map((stat, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="text-indigo-600 dark:text-indigo-400">{stat.icon}</div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proposals Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold">Your Proposals</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : proposals.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Create your first AI-powered proposal in under 60 seconds.
              </p>
              <Link href="/dashboard/new" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Proposal
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Proposal</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Client</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Value</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Date</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {proposals.map((proposal) => {
                    const status = statusConfig[proposal.status] || statusConfig.DRAFT;
                    return (
                      <tr key={proposal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-4">
                          <Link href={`/dashboard/proposal/${proposal.id}`} className="font-medium hover:text-indigo-600">
                            {proposal.title}
                          </Link>
                          <div className="text-xs text-slate-500 capitalize">{proposal.template}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div>{proposal.clientName}</div>
                          {proposal.clientCompany && (
                            <div className="text-sm text-slate-500">{proposal.clientCompany}</div>
                          )}
                        </td>
                        <td className="px-4 py-4 font-medium">
                          {proposal.pricing?.currency || '$'}{proposal.pricing?.total?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                            {status.icon}
                            {proposal.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
