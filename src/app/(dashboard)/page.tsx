import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { PlusCircle, Flame, Clock, Target, Users } from 'lucide-react'
import { LeadCard, type Lead } from '@/components/lead-card'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile to check if they are a manager
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Removed redirect so managers can still view their personal dashboard pipeline

  // Fetch only this user's leads. We must explicitly filter this because
  // the 'manager' RLS policy otherwise allows viewing EVERYTHING.
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (leadsError) {
    console.error("Error fetching leads on dashboard:", leadsError)
  }

  // Calculate some simple metrics
  const hotLeadsCount = leads?.filter(l => l.temperature === 'Hot').length || 0
  const totalLeads = leads?.length || 0
  const followUps = leads?.filter(l => l.lead_type === 'Follow up').length || 0
  const avgProbability = leads && leads.length > 0
    ? Math.round(leads.reduce((acc, curr) => acc + (curr.probability || 0), 0) / leads.length)
    : 0

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">My Pipeline</h1>
          <p className="text-[var(--color-secondary)] opacity-80 mt-1">Today's tracking metrics</p>
        </div>
        <Link href="/leads/add" className="btn-primary hidden sm:flex">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Lead
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card !p-4">
          <div className="flex items-center gap-2 mb-2 text-[var(--color-secondary)]">
            <Users className="w-4 h-4" />
            <h3 className="text-sm font-medium">Total Leads</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-primary)]">{totalLeads}</p>
        </div>

        <div className="card !p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2 text-orange-600">
            <Flame className="w-4 h-4" />
            <h3 className="text-sm font-medium">Hot Leads</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-primary)]">{hotLeadsCount}</p>
        </div>

        <div className="card !p-4">
          <div className="flex items-center gap-2 mb-2 text-[var(--color-secondary)]">
            <Clock className="w-4 h-4" />
            <h3 className="text-sm font-medium">Follow Ups</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-primary)]">{followUps}</p>
        </div>

        <div className="card !p-4">
          <div className="flex items-center gap-2 mb-2 text-[var(--color-secondary)]">
            <Target className="w-4 h-4" />
            <h3 className="text-sm font-medium">Avg Prob.</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--color-primary)]">{avgProbability}%</p>
        </div>
      </div>

      {/* Recent Leads List */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">Recent Interactions</h2>

        {(!leads || leads.length === 0) ? (
          <div className="card text-center py-12">
            <div className="bg-[var(--color-background)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
              <Users className="w-8 h-8 text-[var(--color-secondary)] opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-[var(--color-primary)]">No leads logged yet</h3>
            <p className="text-[var(--color-secondary)] opacity-80 mt-2 mb-6 max-w-sm mx-auto">
              Start building your pipeline by logging your first client interaction today.
            </p>
            <Link href="/leads/add" className="btn-primary">
              Log Interaction
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {leads.map((lead: Lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
