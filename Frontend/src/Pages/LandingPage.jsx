const LandingPage = () => {
  return (
    <div>
        <div className="min-h-screen bg-[url(/landing.jpg)] bg-cover bg-center flex items-center justify-center px-4">
            <div className="w-full max-w-4xl bg-transparent border-0 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-gray-900">
                        Welcome to Library Management System
                    </h1>
                    <p className="text-gray-500 mt-4 text-lg">
                        Manage your library efficiently and effectively with our user-friendly platform.
                    </p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                            Login
                        </a>
                        <a href="/signup" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                            Sign Up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LandingPage