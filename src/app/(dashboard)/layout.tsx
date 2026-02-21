import { TopNav, BottomNav, SideNav } from "@/components/navigation";
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, first_name')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'sales'
    const firstName = profile?.first_name || ''

    return (
        <>
            <TopNav firstName={firstName} />
            <div className="flex min-h-screen pt-16 sm:pb-0 pb-16">
                <SideNav role={role} />
                <main className="flex-1 sm:ml-64 p-4 sm:p-8 overflow-x-hidden">
                    <div className="max-w-4xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
            <BottomNav role={role} />
        </>
    );
}
