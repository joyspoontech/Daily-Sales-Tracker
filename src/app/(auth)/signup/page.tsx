import { signup } from '../login/actions'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const params = await searchParams;

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 min-h-screen bg-[var(--color-background)] mx-auto">
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Building2 className="text-[var(--color-cta)] w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--color-primary)]">Sales Team Signup</h1>
                <p className="text-[var(--color-secondary)] text-sm opacity-80 mt-1">Create your tracking account</p>
            </div>

            <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-[var(--color-foreground)]">
                <div className="card w-full">
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="first_name">
                                First Name
                            </label>
                            <input
                                className="input"
                                name="first_name"
                                placeholder="Jane"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="last_name">
                                Last Name
                            </label>
                            <input
                                className="input"
                                name="last_name"
                                placeholder="Doe"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="input"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-secondary)]" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="input"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {params?.message && (
                            <p className="mt-2 p-3 bg-red-100/50 text-red-900 border border-red-200 text-sm text-center rounded-lg">
                                {params.message}
                            </p>
                        )}

                        <button formAction={signup} className="btn-primary mt-4 w-full h-[52px]">
                            Register Account
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[var(--color-cta)] hover:underline font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
