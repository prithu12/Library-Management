import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { axiosInstance } from '../utils/axiosInstance'

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'

const emptyForm = { name: '', email: '', password: '', confirmPassword: '' }

const Signup = () => {
  const { setUser, navigate } = useContext(AppContext)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError('Please fill in every field.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const { data } = await axiosInstance.post('/auth/signup', {
        name,
        email,
        password: form.password,
      })

      setUser(data.user)
      navigate('/student/dashboard', { replace: true })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to create your account. Please check your connection and try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[url(/login.jpg)] bg-cover bg-center flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-sm shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black-900">Create Account</h1>
          <p className="text-gray-800 mt-2">Join our library management system</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              className={inputClass}
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className={inputClass}
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                autoComplete="new-password"
                className={`${inputClass} pr-16`}
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:underline"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-gray-800 mt-1">Use at least 8 characters.</p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={inputClass}
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={submitting}
              minLength={8}
              required
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
            )}
          </div>

          {error && (
            <p
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
