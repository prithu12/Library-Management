import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="min-h-screen bg-[url(/login.jpg)] bg-cover bg-center flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-transparent border-0 rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Library Management
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Please login to your account.
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                         outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg 
                       font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;