'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Use type assertions for form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        redirect('/login?message=Email and password are required')
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Custom fields
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string

    if (!email || !password || !first_name || !last_name) {
        redirect('/signup?message=All fields are required')
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name,
                last_name,
                role: 'sales', // ensure role is set appropriately
            }
        }
    })

    if (error) {
        redirect(`/signup?message=${encodeURIComponent(error.message)}`)
    }

    // If Supabase has email confirmations enabled, the user won't be signed in automatically.
    if (!data.session) {
        redirect('/login?message=Registration successful! Please check your email to confirm your account.')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
