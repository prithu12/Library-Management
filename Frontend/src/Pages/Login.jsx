import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { axiosInstance } from '../utils/axiosInstance'

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'

const Login = () => {
  const { setUser, navigate } = useContext(AppContext)
  const [form, setForm] = useState({ email: '', password: '' })
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

    const email = form.email.trim().toLowerCase()
    if (!email || !form.password) {
      setError('Please enter both your email and password.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const { data } = await axiosInstance.post('/auth/login', {
        email,
        password: form.password,
      })

      setUser(data.user)
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', {
        replace: true,
      })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to login. Please check your connection and try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[url(/login.jpg)] bg-cover bg-center flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative w-full max-w-md rounded-2xl bg-white/05 backdrop-blur-sm shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black-900">Library Management</h1>
          <p className="text-black-500 mt-2">Welcome back! Please login to your account.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`${inputClass} pr-16`}
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
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
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
