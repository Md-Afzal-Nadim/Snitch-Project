import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import ContinueWithGoogle from '../components/ContinueWithGoogle'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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
      const user = await handleLogin(formData)
      if (user.role == "buyer") {
        navigate('/home')
      } else if (user.role == "seller") {
        navigate('/seller/dashboard')
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[#fafafa] flex flex-col lg:flex-row">

      {/* Left: Hero */}
      <section className="hidden lg:flex w-1/2 h-full relative overflow-hidden flex-col justify-between">
        <img
       src=" https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1600&auto=format&fit=crop"
          alt="Urban Fit"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

        {/* Brand */}
        <div className="relative p-10 xl:p-12">
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">Urban Fit</h1>
        </div>

        {/* Bottom content */}
        <div className="relative p-10 xl:p-12">
          <h2 className="text-5xl xl:text-6xl font-extrabold uppercase leading-[0.95] text-white tracking-tight">
            Architect<br />
            Precision.
          </h2>
          <p className="mt-5 max-w-md text-sm xl:text-base text-neutral-200 leading-relaxed">
            Understated luxury for the modern man. Curated for those who value structural clarity.
          </p>
        </div>
      </section>

      {/* Right: Form */}
      <section className="w-full lg:w-1/2 h-full overflow-y-auto flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-8 lg:py-10">
        <div className="max-w-md w-full mx-auto lg:mx-0">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">Sign In</h2>
            <p className="mt-3 text-neutral-500 text-base">Enter your credentials to access your urban vault.</p>
          </div>

         
          <div className="mt-2">
            <ContinueWithGoogle />
          </div>



          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[11px] font-medium tracking-[0.15em] text-neutral-400 uppercase whitespace-nowrap">
              Or login with email
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@domain.com"
                className="w-full border-b border-neutral-300 bg-transparent pb-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[11px] font-semibold tracking-[0.15em] text-neutral-500 uppercase">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] font-medium tracking-[0.1em] text-neutral-500 uppercase hover:text-neutral-900 transition">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full border-b border-neutral-300 bg-transparent pb-3 pr-9 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-0 text-neutral-400 transition hover:text-neutral-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-none border-neutral-400 text-neutral-900 focus:ring-neutral-900"
              />
              <span className="text-[11px] font-semibold tracking-[0.15em] text-neutral-700 uppercase">
                Remember Me
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-900 px-4 py-3.5 text-sm font-semibold tracking-[0.1em] uppercase text-white transition hover:bg-neutral-800 active:scale-[0.99]"
            >
              Login
            </button>
          </form>

          {message ? (
            <p className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {message}
            </p>
          ) : null}


          <p className="mt-6 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-700">
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Login