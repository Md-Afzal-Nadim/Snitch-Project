import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { Link, useNavigate } from 'react-router'
import  ContinueWithGoogle  from "../components/ContinueWithGoogle"

const Register = () => {


  const { handleRegister } = useAuth()

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullname: '',
    contact: '',
    email: '',
    password: '',
    isSeller: false,
  })


  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleRegister(
      formData.email,
      formData.contact,
      formData.password,
      formData.fullname,
      formData.isSeller
    );

    navigate('/');
  };


  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#0b0b0f_0%,#17161d_45%,#121217_100%)] text-[#f5d97a] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl border border-[#f5d97a]/20 bg-[#111218]/95 shadow-[0_18px_60px_rgba(0,0,0,0.45)] overflow-hidden grid md:grid-cols-2">
        <section className="hidden md:flex flex-col justify-between bg-[radial-gradient(circle_at_top,#2a240d_0%,#141411_45%,#0b0b0f_100%)] p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#f5d97a]/75">Snitch</p>
            <h1 className="mt-4 text-4xl font-semibold text-[#fff7d6]">Create your account</h1>
            <p className="mt-4 max-w-sm text-[#e5debf] text-sm leading-6">A clean, modern sign-up page with golden accents, generous spacing, and a smooth dark theme for your storefront experience.</p>
          </div>
          <div className="rounded-2xl border border-[#f5d97a]/15 bg-[#17161d] p-4 text-sm text-[#f6e8b7]">
            <p className="font-medium">Why sellers love it</p>
            <p className="mt-1 text-[#dcd4b6]">Simple onboarding, quick setup, and a premium visual feel from the very first click.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f5d97a]/80">Register</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#fff7d6]">Start your journey</h2>
            <p className="mt-2 text-sm text-[#e4ddc1]">Fill in your details below to create a new account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-[#f2e6b6]">
              Full name
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="Alex Johnson"
                className="mt-1 w-full rounded-2xl border border-[#f5d97a]/20 bg-[#17161d] px-4 py-3 text-[#fffaf0] outline-none ring-0 placeholder:text-[#b8ae8d] focus:border-[#f5d97a] focus:ring-2 focus:ring-[#f5d97a]/25"
              />
            </label>

            <label className="block text-sm text-[#f2e6b6]">
              Contact number
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="+1 234 567 890"
                className="mt-1 w-full rounded-2xl border border-[#f5d97a]/20 bg-[#17161d] px-4 py-3 text-[#fffaf0] outline-none placeholder:text-[#b8ae8d] focus:border-[#f5d97a] focus:ring-2 focus:ring-[#f5d97a]/25"
              />
            </label>

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
                placeholder="Minimum 6 characters"
                className="mt-1 w-full rounded-2xl border border-[#f5d97a]/20 bg-[#17161d] px-4 py-3 text-[#fffaf0] outline-none placeholder:text-[#b8ae8d] focus:border-[#f5d97a] focus:ring-2 focus:ring-[#f5d97a]/25"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-[#f5d97a]/15 bg-[#17161d] px-4 py-3 text-sm text-[#f4e6b2]">
              <input
                type="checkbox"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[#f5d97a]/40 bg-[#0b0b0f] text-[#f5d97a] focus:ring-[#f5d97a]/30"
              />
              I want to register as a seller
            </label>



            <button
              type="submit"
              className="w-full rounded-2xl bg-[#f5d97a] px-4 py-3 text-sm font-semibold text-[#151515] shadow-[0_10px_25px_rgba(245,217,122,0.18)] transition hover:bg-[#ffe58a] focus:outline-none focus:ring-2 focus:ring-[#f5d97a]/35"
            >
              Create account
            </button>
          </form>


        <ContinueWithGoogle />




          
          {message ? (
            <p className="mt-4 rounded-2xl border border-[#f5d97a]/15 bg-[#17161d] px-4 py-3 text-sm text-[#fff3c3]">{message}</p>
          ) : null}

          <p className="mt-5 text-sm text-[#e5debf]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#ffe58a] hover:text-[#fff5c7]">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Register
