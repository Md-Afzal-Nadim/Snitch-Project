import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import ContinueWithGoogle from '../components/ContinueWithGoogle'

const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const user =await handleLogin(formData)
      if (user.role == "buyer") {
      navigate('/')
      } else if (user.role == "seller") {
        navigate('/seller/dashboard')
        
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#0b0b0f_0%,#17161d_45%,#121217_100%)] text-[#f5d97a] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl border border-[#f5d97a]/20 bg-[#111218]/95 shadow-[0_18px_60px_rgba(0,0,0,0.45)] overflow-hidden grid md:grid-cols-2">
          <section className="hidden md:flex flex-col justify-between bg-[radial-gradient(circle_at_top,#2a240d_0%,#141411_45%,#0b0b0f_100%)] p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#f5d97a]/75">Snitch</p>
            <h1 className="mt-4 text-4xl font-semibold text-[#fff7d6]">Welcome back</h1>
            <p className="mt-4 max-w-sm text-[#e5debf] text-sm leading-6">A simple, polished login view with the same golden highlights, generous spacing, and dark premium look.</p>
          </div>
          <div className="rounded-2xl border border-[#f5d97a]/15 bg-[#17161d] p-4 text-sm text-[#f6e8b7]">
            <p className="font-medium">Easy access</p>
            <p className="mt-1 text-[#dcd4b6]">Sign in quickly and continue to your dashboard with a calm, modern interface.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f5d97a]/80">Login</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#fff7d6]">Access your account</h2>
            <p className="mt-2 text-sm text-[#e4ddc1]">Enter your email and password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-[#f2e6b6]">
              Email address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-2xl border border-[#f5d97a]/20 bg-[#17161d] px-4 py-3 text-[#fffaf0] outline-none placeholder:text-[#b8ae8d] focus:border-[#f5d97a] focus:ring-2 focus:ring-[#f5d97a]/25"
              />
            </label>

            <label className="block text-sm text-[#f2e6b6]">
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="mt-1 w-full rounded-2xl border border-[#f5d97a]/20 bg-[#17161d] px-4 py-3 text-[#fffaf0] outline-none placeholder:text-[#b8ae8d] focus:border-[#f5d97a] focus:ring-2 focus:ring-[#f5d97a]/25"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#f5d97a] px-4 py-3 text-sm font-semibold text-[#151515] shadow-[0_10px_25px_rgba(245,217,122,0.18)] transition hover:bg-[#ffe58a] focus:outline-none focus:ring-2 focus:ring-[#f5d97a]/35"
            >
              Sign in
            </button>
          </form>

          <ContinueWithGoogle />

          {message ? (
            <p className="mt-4 rounded-2xl border border-[#f5d97a]/15 bg-[#17161d] px-4 py-3 text-sm text-[#fff3c3]">{message}</p>
          ) : null}

          <p className="mt-5 text-sm text-[#e5debf]">
            New here?{' '}
            <Link to="/register" className="font-semibold text-[#ffe58a] hover:text-[#fff5c7]">Create an account</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Login
