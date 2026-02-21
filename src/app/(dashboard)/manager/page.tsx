import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Flame, Snowflake, Building2, UserCircle2 } from 'lucide-react'
import { TeamActivityFilters } from '@/components/team-activity-filters'

type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    role: 'sales' | 'manager';
}

type LeadWithProfile = {
    id: string;
    person_name: string;
    company_name: string | null;
    temperature: 'Hot' | 'Cold';
    probability: number;
    lead_type: 'Fresh lead' | 'Follow up';
    created_at: string;
    created_by: string;
    profiles: {
        first_name: string;
        last_name: string;
    }
}

export default async function ManagerDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; rep?: string; temp?: string }>
}) {
    const params = await searchParams;
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch the user's profile to verify manager status
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'manager') {
        redirect('/')
    }

    // Fetch reps for the filter dropdown
    const { data: repsData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('first_name')

    // Since we are manager, RLS allows us to see all leads
    // We build the query dynamically based on filters
    let query = supabase
        .from('leads')
        .select('*, profiles!inner(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(50)

    if (params.q) {
        query = query.or(`person_name.ilike.%${params.q}%,company_name.ilike.%${params.q}%`)
    }
    if (params.rep) {
        query = query.eq('created_by', params.rep)
    }
    if (params.temp) {
        query = query.eq('temperature', params.temp)
    }

    const { data: leadsData } = await query

    // Type assertion since Supabase types are dynamic without codegen
    const leads = leadsData as unknown as LeadWithProfile[]
    const reps = (repsData || []) as { id: string; first_name: string; last_name: string }[]

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">Team Activity</h1>
                <p className="text-[var(--color-secondary)] opacity-80 mt-1">Manager overview of all sales reps in the field.</p>
            </div>

            <TeamActivityFilters reps={reps} />

            <div className="card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[var(--color-secondary)] uppercase bg-gray-50 border-b">
                            <tr>
                                <th scope="col" className="px-6 py-4">Sales Rep</th>
                                <th scope="col" className="px-6 py-4">Lead Detail</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4 text-right">Time Logged</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!leads || leads.length === 0) ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[var(--color-secondary)]">
                                        No leads have been logged by the team yet.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[var(--color-primary)] flex items-center gap-2">
                                            <UserCircle2 className="w-4 h-4 text-gray-400" />
                                            {lead.profiles?.first_name} {lead.profiles?.last_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[var(--color-primary)]">{lead.person_name}</span>
                                                {lead.company_name && (
                                                    <span className="text-xs text-[var(--color-secondary)] flex items-center gap-1 mt-0.5">
                                                        <Building2 className="w-3 h-3" /> {lead.company_name}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {lead.temperature === 'Hot' ? (
                                                    <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                                                        <Flame className="w-3 h-3" /> HOT
                                                    </span>
                                                ) : (
                                                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                                                        <Snowflake className="w-3 h-3" /> COLD
                                                    </span>
                                                )}
                                                <span className="text-xs text-[var(--color-secondary)] font-medium">
                                                    {lead.probability}% • {lead.lead_type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs text-gray-500 space-x-2">
                                            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
