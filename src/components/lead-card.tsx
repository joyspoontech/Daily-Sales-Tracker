'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Flame, Snowflake, Building2, Phone, Mail, Link as LinkIcon, X, Pencil } from 'lucide-react'
import Link from 'next/link'

export type Lead = {
    id: string;
    person_name: string;
    company_name: string | null;
    email: string | null;
    mobile: string | null;
    linkedin_url: string | null;
    social_url: string | null;
    temperature: 'Hot' | 'Cold';
    probability: number;
    lead_type: 'Fresh lead' | 'Follow up';
    created_at: string;
}

export function LeadCard({ lead }: { lead: Lead }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="card card-interactive !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[var(--color-primary)]">{lead.person_name}</h3>
                        {lead.temperature === 'Hot' ? (
                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Hot
                            </span>
                        ) : (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Snowflake className="w-3 h-3" /> Cold
                            </span>
                        )}
                    </div>
                    {lead.company_name && (
                        <p className="text-sm text-[var(--color-secondary)] mt-1 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {lead.company_name}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                    <div className="flex flex-col items-start sm:items-end w-full max-w-[120px]">
                        <span className="text-xs text-[var(--color-secondary)] font-medium mb-1">Probability</span>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-cta)] transition-all duration-500"
                                style={{ width: `${lead.probability || 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                        <span className="block text-xs font-semibold bg-gray-100 text-[var(--color-secondary)] px-2 py-1 rounded">
                            {lead.lead_type}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1 block">
                            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 modal-overlay cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="modal relative z-10 animate-in fade-in zoom-in-95 duration-200 !p-6 sm:!p-8">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <Link
                                href={`/leads/${lead.id}/edit`}
                                className="p-2 text-gray-400 hover:text-[var(--color-primary)] bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                                title="Edit Lead"
                            >
                                <Pencil className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6 pr-8">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-[var(--color-primary)]">{lead.person_name}</h2>
                                {lead.temperature === 'Hot' ? (
                                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5" /> Hot Lead
                                    </span>
                                ) : (
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                                        <Snowflake className="w-3.5 h-3.5" /> Cold Lead
                                    </span>
                                )}
                            </div>
                            {lead.company_name && (
                                <p className="text-lg text-[var(--color-secondary)] flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                    {lead.company_name}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-1">Interaction Type</span>
                                <span className="font-medium text-[var(--color-primary)]">{lead.lead_type}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2">Conversion Probability</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[var(--color-cta)] text-lg">{lead.probability || 0}%</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--color-cta)]"
                                            style={{ width: `${lead.probability || 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Contact Information</h3>

                            {lead.mobile ? (
                                <a href={`tel:${lead.mobile}`} className="flex items-center gap-3 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors p-3 hover:bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium">{lead.mobile}</span>
                                </a>
                            ) : (
                                <div className="flex items-center gap-3 text-gray-400 p-3">
                                    <Phone className="w-5 h-5 opacity-50" />
                                    <span className="italic">No phone number provided</span>
                                </div>
                            )}

                            {lead.email ? (
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-3 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors p-3 hover:bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium break-all">{lead.email}</span>
                                </a>
                            ) : (
                                <div className="flex items-center gap-3 text-gray-400 p-3">
                                    <Mail className="w-5 h-5 opacity-50" />
                                    <span className="italic">No email provided</span>
                                </div>
                            )}

                            {(lead.linkedin_url || lead.social_url) && (
                                <div className="flex flex-col gap-2 pt-2">
                                    {lead.linkedin_url && (
                                        <a href={lead.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[var(--color-cta)] hover:underline p-3 hover:bg-gray-50 rounded-xl">
                                            <LinkIcon className="w-5 h-5" />
                                            <span className="font-medium truncate">LinkedIn Profile</span>
                                        </a>
                                    )}
                                    {lead.social_url && (
                                        <a href={lead.social_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[var(--color-cta)] hover:underline p-3 hover:bg-gray-50 rounded-xl">
                                            <LinkIcon className="w-5 h-5" />
                                            <span className="font-medium truncate">Other Social Profile</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
