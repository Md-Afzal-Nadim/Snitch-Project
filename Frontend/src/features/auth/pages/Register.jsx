import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { Link, useNavigate } from 'react-router'
import ContinueWithGoogle from "../components/ContinueWithGoogle"
import { ShoppingBag, Store, Eye, EyeOff, CircleCheck } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)

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

    if (formData.isSeller) {
  navigate("/seller/dashboard");
} else {
  navigate("/home");
}

    //navigate('/home');
  };

  return (
    <div className="h-screen overflow-hidden bg-[#fafafa] flex flex-col lg:flex-row">

      {/* Left: Hero */}
      <section className="hidden lg:block w-1/2 h-full relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1600&auto=format&fit=crop"
          alt="Urban Fit seasonal collection"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />

        {/* Member benefits card */}
        <div className="absolute top-8 right-8 w-64 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md p-5">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-neutral-300 uppercase mb-3">
            Member Benefits
          </p>
          <ul className="space-y-2.5">
            {['Early Access Drop', 'Concierge Tailoring', 'Global Free Shipping'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white">
                <CircleCheck size={16} className="text-white/80 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-10 xl:p-14">
          <span className="inline-block border border-white/40 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-white uppercase mb-6">
            Seasonal Collection '24
          </span>
          <h2 className="text-5xl xl:text-6xl font-extrabold uppercase leading-[0.95] text-white tracking-tight">
            The<br />
            Architect<br />
            of Your<br />
            Identity.
          </h2>
          <p className="mt-6 max-w-md text-sm xl:text-base text-neutral-200 leading-relaxed">
            Experience garments engineered for the modern metropolitan landscape. Minimalist silhouettes, technical fabrics, and timeless construction.
          </p>
        </div>
      </section>

      {/* Right: Form */}
      <section className="w-full lg:w-1/2 h-full overflow-y-auto flex flex-col px-6 sm:px-12 lg:px-16 xl:px-20 py-8 lg:py-10">
        <div className="max-w-md w-full mx-auto lg:mx-0 flex-1 flex flex-col">

          {/* Brand */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">URBAN FIT</h1>
            <p className="mt-1 text-[11px] sm:text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
              Architectural Precision in Menswear
            </p>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">Create Account</h2>
            <p className="mt-2 text-neutral-500 text-base">Join the elite urban collective.</p>
          </div>

          {/* Google */}

          
          <div className="mt-1">
            <ContinueWithGoogle />
          </div>

          
          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[11px] font-medium tracking-[0.15em] text-neutral-400 uppercase whitespace-nowrap">
              Or register with email
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label htmlFor="fullname" className="block text-[11px] font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-1.5">
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full border-b border-neutral-300 bg-transparent pb-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
              />
            </div>

            {/* Mobile + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact" className="block text-[11px] font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-1.5">
                  Mobile Number
                </label>
                <input
                  id="contact"
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full border-b border-neutral-300 bg-transparent pb-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
                />
              </div>

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
                  placeholder="john@urbanfit.com"
                  className="w-full border-b border-neutral-300 bg-transparent pb-3 text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[11px] font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Minimum 6 characters"
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

            {/* Register as */}
            <div>
              <p className="block text-[11px] font-semibold tracking-[0.15em] text-neutral-500 uppercase mb-2">
                Register As
              </p>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-5 cursor-pointer transition ${
                    !formData.isSeller
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    className="sr-only"
                    checked={!formData.isSeller}
                    onChange={() => setFormData((prev) => ({ ...prev, isSeller: false }))}
                  />
                  <ShoppingBag size={20} strokeWidth={1.5} className="text-neutral-800" />
                  <span className="text-sm font-medium text-neutral-800">Buyer</span>
                </label>

                <label
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-5 cursor-pointer transition ${
                    formData.isSeller
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    className="sr-only"
                    checked={formData.isSeller}
                    onChange={() => setFormData((prev) => ({ ...prev, isSeller: true }))}
                  />
                  <Store size={20} strokeWidth={1.5} className="text-neutral-800" />
                  <span className="text-sm font-medium text-neutral-800">Seller</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-neutral-900 px-4 py-3.5 text-sm font-semibold tracking-[0.1em] uppercase text-white transition hover:bg-neutral-800 active:scale-[0.99]"
            >
              Register
            </button>
          </form>


          {message ? (
            <p className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              {message}
            </p>
          ) : null}

          <p className="mt-4 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-neutral-900 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="max-w-md w-full mx-auto lg:mx-0 mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-400">
          <span>©2024 URBAN FIT</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-700 transition">Privacy</a>
            <a href="#" className="hover:text-neutral-700 transition">Terms</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Register