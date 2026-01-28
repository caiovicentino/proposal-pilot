'use client';

import { useUser } from '@stackframe/stack';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  Download,
  Send,
  Edit3,
  Save,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building,
  Loader2
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  brief: string;
  scope: string;
  deliverables: string;
  timeline: string;
  pricing: { items: Array<{ name: string; description: string; price: number }>; total: number; currency: string };
  terms: string;
  template: string;
  status: string;
  createdAt: string;
}

export default function ProposalView() {
  const user = useUser();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedProposal, setEditedProposal] = useState<Partial<Proposal>>({});

  useEffect(() => {
    if (user === null) {
      router.push('/handler/sign-in');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchProposal();
    }
  }, [id, user]);

  async function fetchProposal() {
    try {
      const res = await fetch(`/api/proposals/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProposal(data);
        setEditedProposal(data);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch proposal:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProposal),
      });
      if (res.ok) {
        const data = await res.json();
        setProposal(data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to save proposal:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleExportPDF() {
    // In a real app, this would generate a proper PDF
    window.print();
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!proposal) return null;

  const currencySymbol = proposal.pricing?.currency === 'BRL' ? 'R$' : 
                         proposal.pricing?.currency === 'EUR' ? '€' : 
                         proposal.pricing?.currency === 'GBP' ? '£' : '$';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 print:bg-white">
      {/* Header - Hidden on print */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold truncate max-w-xs">{proposal.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button onClick={handleExportPDF} className="btn-secondary text-sm py-2 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button className="btn-primary text-sm py-2 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Proposal Document */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0 print:px-0 print:max-w-none">
        <div className="card p-8 md:p-12 print:shadow-none print:border-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 print:hidden">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {editing ? (
                  <input
                    type="text"
                    value={editedProposal.title || ''}
                    onChange={(e) => setEditedProposal({ ...editedProposal, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                  />
                ) : proposal.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 capitalize">{proposal.template} Proposal</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Date</div>
              <div className="font-medium">{new Date(proposal.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Prepared For</h2>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-slate-400" />
                {editing ? (
                  <input
                    type="text"
                    value={editedProposal.clientName || ''}
                    onChange={(e) => setEditedProposal({ ...editedProposal, clientName: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
                  />
                ) : (
                  <span className="font-medium">{proposal.clientName}</span>
                )}
              </div>
              {proposal.clientCompany && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{proposal.clientCompany}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Project Value</div>
              <div className="text-3xl font-bold text-indigo-600">
                {currencySymbol}{proposal.pricing?.total?.toLocaleString() || 0}
              </div>
            </div>
          </div>

          {/* Scope */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              Scope of Work
            </h2>
            {editing ? (
              <textarea
                value={editedProposal.scope || ''}
                onChange={(e) => setEditedProposal({ ...editedProposal, scope: e.target.value })}
                className="w-full h-40 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3"
              />
            ) : (
              <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{proposal.scope}</div>
            )}
          </section>

          {/* Deliverables */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Deliverables
            </h2>
            {editing ? (
              <textarea
                value={editedProposal.deliverables || ''}
                onChange={(e) => setEditedProposal({ ...editedProposal, deliverables: e.target.value })}
                className="w-full h-40 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3"
              />
            ) : (
              <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{proposal.deliverables}</div>
            )}
          </section>

          {/* Timeline */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Timeline
            </h2>
            {editing ? (
              <textarea
                value={editedProposal.timeline || ''}
                onChange={(e) => setEditedProposal({ ...editedProposal, timeline: e.target.value })}
                className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3"
              />
            ) : (
              <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{proposal.timeline}</div>
            )}
          </section>

          {/* Pricing */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Investment
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Item</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Description</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.pricing?.items?.map((item, i) => (
                    <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.description}</td>
                      <td className="px-4 py-3 text-right">{currencySymbol}{item.price.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50 dark:bg-indigo-900/20">
                    <td colSpan={2} className="px-4 py-3 font-semibold">Total</td>
                    <td className="px-4 py-3 text-right font-bold text-lg text-indigo-600">
                      {currencySymbol}{proposal.pricing?.total?.toLocaleString() || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Terms */}
          {proposal.terms && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
              <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{proposal.terms}</div>
            </section>
          )}

          {/* Signature */}
          <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 print:mt-24">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-sm text-slate-500 mb-2">Accepted by Client</div>
                <div className="border-b-2 border-slate-300 dark:border-slate-600 pb-2 mb-2 h-12"></div>
                <div className="text-sm text-slate-500">Signature & Date</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-2">Prepared by</div>
                <div className="font-medium">{user.displayName || user.primaryEmail}</div>
                <div className="text-sm text-slate-500 mt-1">ProposalPilot</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
