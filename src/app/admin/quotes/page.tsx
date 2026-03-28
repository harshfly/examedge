'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Quote, Plus, Loader2, Trash2, Edit2, Save, X } from "lucide-react";

interface MotivationQuote {
  id: string;
  text: string;
  author: string;
  active: boolean;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<MotivationQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuotes(data || []);
    } catch (err: any) {
      console.error('Error fetching quotes:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddQuote() {
    if (!newQuote.text) return;
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('quotes')
        .insert([{ ...newQuote, active: true }])
        .select();
      
      if (error) throw error;
      setQuotes([data[0], ...quotes]);
      setNewQuote({ text: '', author: '' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQuote(id: string) {
    if (!confirm('Are you sure you want to delete this quote?')) return;
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setQuotes(quotes.filter(q => q.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function toggleQuoteActive(id: string, current: boolean) {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ active: !current })
        .eq('id', id);
      
      if (error) throw error;
      setQuotes(quotes.map(q => q.id === id ? { ...q, active: !current } : q));
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h2 flex items-center gap-3">
            <Quote className="text-[var(--accent)]" /> 
            Motivational Quotes
          </h1>
          <p className="text-[var(--text-muted)] text-[14px]">
            Manage positive lines and quotes shown to students on their dashboard.
          </p>
        </div>
      </div>

      {/* Add New Section */}
      <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-xl)] p-6 mb-10">
        <h3 className="text-[14px] font-bold mb-4">Post New Quote</h3>
        <div className="flex flex-col gap-4">
          <textarea 
            placeholder="Type a beautiful motivational line here..."
            className="input-field min-h-[100px] resize-none py-3"
            value={newQuote.text}
            onChange={(e) => setNewQuote({...newQuote, text: e.target.value})}
          />
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Author (e.g. Steve Jobs) - Optional"
              className="input-field flex-1 py-2.5"
              value={newQuote.author}
              onChange={(e) => setNewQuote({...newQuote, author: e.target.value})}
            />
            <button 
              onClick={handleAddQuote}
              disabled={saving || !newQuote.text}
              className="btn-primary px-8 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border)] rounded-xl">
             <p className="text-[var(--text-muted)]">No quotes added yet. Be the motivation students need! ✨</p>
          </div>
        ) : (
          quotes.map((quote) => (
            <div key={quote.id} className={`bg-[var(--bg-overlay)] border rounded-[var(--r-lg)] p-5 flex items-start justify-between gap-6 group transition-all
              ${quote.active ? 'border-[var(--border)]' : 'border-dashed opacity-50'}
            `}>
              <div className="flex-1">
                <p className="text-[16px] italic text-[#f0f0f8] mb-2 leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
                <p className="text-[12px] font-bold text-[var(--accent)]">— {quote.author || 'Anonymous'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleQuoteActive(quote.id, quote.active)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors
                    ${quote.active ? 'bg-[#10b98120] text-[#10b981]' : 'bg-[var(--glass)] text-[var(--text-muted)]'}
                  `}
                >
                  {quote.active ? 'Active' : 'Draft'}
                </button>
                <button 
                  onClick={() => handleDeleteQuote(quote.id)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
