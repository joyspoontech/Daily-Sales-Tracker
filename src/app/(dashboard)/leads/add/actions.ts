'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addLead(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Parse form data
    const rawData = {
        created_by: user.id,
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
        redirect('/leads/add?message=Missing required fields')
    }

    const { error } = await supabase.from('leads').insert(rawData)

    if (error) {
        console.error('Error inserting lead:', error)
        redirect('/leads/add?message=Failed to insert lead. Please try again.')
    }

    revalidatePath('/')
    redirect('/?success=Lead added successfully')
}
