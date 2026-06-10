import React from 'react'

const ContinueWithGoogle = () => {
  return (
    <a
      href="/api/auth/google"
      className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#d0d5dd] bg-white px-4 py-3 text-sm font-medium text-[#3c4043] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition hover:bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#4285f4]/30"
      aria-label="Continue with Google"
    >
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.84 13.94A6.94 6.94 0 0 1 5.84 10.06V7.22H2.18a11.99 11.99 0 0 0 0 13.44l3.66-2.72Z" />
        <path fill="#EA4335" d="M12 5.98c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.46 2.02 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.22l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
      </svg>
      <span>Continue with Google</span>
    </a>
  )
}

export default ContinueWithGoogle
