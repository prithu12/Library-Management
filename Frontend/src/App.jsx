import Login from './Pages/Login'
import Signup from './Pages/Signup'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    </div>
  )
}

export default App