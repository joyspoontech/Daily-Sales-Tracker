import { editLead } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PlusCircle, Info, Building2, User, Phone, Link as LinkIcon, Mail } from 'lucide-react'
import { ProbabilitySlider } from '@/components/probability-slider'

export default async function EditLeadPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ message: string }>
}) {
    const resolvedParams = await params;
    const resolvedSP = await searchParams;

    const leadId = resolvedParams.id;
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch the lead to pre-populate
    const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

    if (error || !lead) {
        notFound()
    }

    // Bind ID to the server action
    const updateAction = editLead.bind(null, leadId)

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-2xl mx-auto pb-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">Edit Interaction</h1>
                <p className="text-[var(--color-secondary)] opacity-80 mt-1">Update details for {lead.person_name}.</p>
            </div>

            {resolvedSP?.message && (
                <div className="p-4 bg-red-100/50 text-red-900 border border-red-200 rounded-lg flex items-start gap-3">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{resolvedSP.message}</p>
                </div>
            )}

            <form action={updateAction} className="flex flex-col gap-6">
                {/* Core Info */}
                <div className="card !p-6 flex flex-col gap-5">
                    <h2 className="text-lg font-semibold text-[var(--color-primary)] border-b pb-2 flex items-center gap-2">
                        <User className="w-5 h-5 text-[var(--color-cta)]" />
                        Contact Detail
                    </h2>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="person_name">
                            Person Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="input"
                            id="person_name"
                            name="person_name"
                            defaultValue={lead.person_name}
                            placeholder="e.g. Jane Doe"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="company_name">
                            Company Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                className="input pl-11"
                                id="company_name"
                                name="company_name"
                                defaultValue={lead.company_name || ''}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                    </div>
                </div>

                {/* Status Info */}
                <div className="card !p-6 flex flex-col gap-5">
                    <h2 className="text-lg font-semibold text-[var(--color-primary)] border-b pb-2 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-[var(--color-cta)]" />
                        Lead Status
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="temperature">
                                Temperature <span className="text-red-500">*</span>
                            </label>
                            <select className="input" name="temperature" id="temperature" required defaultValue={lead.temperature}>
                                <option value="Hot">🔥 Hot</option>
                                <option value="Cold">❄️ Cold</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="lead_type">
                                Lead Type <span className="text-red-500">*</span>
                            </label>
                            <select className="input" name="lead_type" id="lead_type" required defaultValue={lead.lead_type}>
                                <option value="Fresh lead">Fresh lead</option>
                                <option value="Follow up">Follow up</option>
                            </select>
                        </div>
                    </div>

                    <ProbabilitySlider initialValue={lead.probability || 0} />
                </div>

                {/* Contact Methods */}
                <div className="card !p-6 flex flex-col gap-5">
                    <h2 className="text-lg font-semibold text-[var(--color-primary)] border-b pb-2 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[var(--color-cta)]" />
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="mobile">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="input pl-11"
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    defaultValue={lead.mobile || ''}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="input pl-11"
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={lead.email || ''}
                                    placeholder="contact@company.com"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="linkedin_url">
                                LinkedIn URL
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="input pl-11"
                                    id="linkedin_url"
                                    name="linkedin_url"
                                    type="url"
                                    defaultValue={lead.linkedin_url || ''}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="social_url">
                                Other Social URL
                            </label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="input pl-11"
                                    id="social_url"
                                    name="social_url"
                                    type="url"
                                    defaultValue={lead.social_url || ''}
                                    placeholder="Twitter, Insta, etc."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Boundary */}
                <div className="sticky bottom-20 sm:bottom-4 z-10 pt-4 pb-2 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)] to-transparent">
                    <button type="submit" className="btn-primary w-full h-14 text-lg shadow-xl shadow-[var(--color-cta)]/20">
                        Update Interaction
                    </button>
                </div>
            </form>
        </div>
    )
}
