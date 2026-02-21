'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function editLead(leadId: string, formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Parse form data
    const rawData = {
        person_name: formData.get('person_name') as string,
        company_name: formData.get('company_name') as string || null,
        email: formData.get('email') as string || null,
        mobile: formData.get('mobile') as string || null,
        linkedin_url: formData.get('linkedin_url') as string || null,
        social_url: formData.get('social_url') as string || null,
        temperature: formData.get('temperature') as 'Hot' | 'Cold',
        probability: parseInt(formData.get('probability') as string) || 0,
        lead_type: formData.get('lead_type') as 'Fresh lead' | 'Follow up',
    }

    // Basic validation
    if (!rawData.person_name || !rawData.temperature || !rawData.lead_type) {
        redirect(`/leads/${leadId}/edit?message=Missing required fields`)
    }

    // Since we want this accessible by both managers (if needed) and the sales rep who created it,
    // we let Supabase RLS handle the authorization of the update.
    const { error } = await supabase
        .from('leads')
        .update(rawData)
        .eq('id', leadId)

    if (error) {
        console.error('Error updating lead:', error)
        redirect(`/leads/${leadId}/edit?message=Failed to update lead. Please try again.`)
    }

    revalidatePath('/')
    revalidatePath('/manager')
    redirect('/?success=Lead updated successfully')
}
