import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppContext } from './context/AppContext'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import AdminLayout from './Pages/admin/AdminLayout'
import AdminDashboard from './Pages/admin/AdminDashboard'
import BookList from './Pages/admin/BookList'
import AddBook from './Pages/admin/AddBook'
import BookBorrowed from './Pages/admin/BookBorrowed'
import BookReturned from './Pages/admin/BookReturned'
import StudentsList from './Pages/admin/StudentsList'
import Layout from './Pages/student/Layout'
import StudentDashboard from './Pages/student/StudentDashboard'
import Books from './Pages/student/Books'
import MyBooks from './Pages/student/MyBooks'

const dashboardPath = (role) => (role === 'admin' ? '/admin/dashboard' : '/student/dashboard')

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">
    Loading...
  </div>
)

const HomeRedirect = () => {
  const { user, loading } = useContext(AppContext)

  if (loading) return <FullPageLoader />

  return <Navigate to={user ? dashboardPath(user.role) : '/login'} replace />
}

// Only for visitors who are not logged in yet.
const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AppContext)

  if (loading) return <FullPageLoader />

  if (user) return <Navigate to={dashboardPath(user.role)} replace />

  return children
}

// Requires a logged in user, optionally of a specific role.
const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useContext(AppContext)

  if (loading) return <FullPageLoader />

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) return <Navigate to={dashboardPath(user.role)} replace />

  return children
}

const App = () => {
  return (
    <div>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="books" element={<BookList />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="borrowed-books" element={<BookBorrowed />} />
          <Route path="returned-books" element={<BookReturned />} />
          <Route path="students" element={<StudentsList />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="my-books" element={<MyBooks />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
