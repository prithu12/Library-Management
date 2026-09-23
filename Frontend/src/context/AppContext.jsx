import { createContext,  useEffect,  useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
export const AppContext=createContext();
const AppContextProvider=({children})=>{
    const [loading,setLoading]=useState(false);
    const [user,setUser]=useState(null);
    const [adminStats,setAdminStats]=useState()
    const [studentStats,setStudentStats]=useState()
    const [studentsBooks,setStudentsBooks]=useState([])
    const [books,setBooks]=useState([])
    const [students,setStudents]=useState([])
    const [borrowedBooks,setBorrowedBooks]=useState([])

    const isAdmin=user && user.role==="admin";
    const navigate=useNavigate();


    const fetchUser=async()=>{
        setLoading(true)
        try {
            const {data}=await axiosInstance.get("/auth/profile");
            if(data.success){
                setUser(data.user)
            }
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }


    
  // Fetch Admin Dashboard Stats
  const   fetchAdminDashboardStats=async()=>{
    try {
        const {data}=await axiosInstance.get("/books/admin/dashboard")
       
        console.log("admin stats",data);
        if(data.success){
            setAdminStats(data)
        }
        
    } catch (error) {
        console.log("error to fetch admin stats",error);
    }
  }
  // Fetch Student Dashboard Stats
  const fetchStudentDashboardStats=async()=>{
    try {
        const {data}=await axiosInstance.get("/borrow/student/dashboard")
        if(data.success){
            setStudentStats(data)
        }
    } catch (error) {
        console.log("error to fetch student stats",error);
    }
  }

  // Fetch Books
  const fetchBooks=async()=>{
    try {
        const {data}=await axiosInstance.get("/books/all")
        if(data.success){
            setBooks(data.books)
        }
        
    } catch (error) {
        console.log("error to fetch books",error);
    }
  }
  // Fetch Students Books
  const fetchStudentBooks=async()=>{
    try {
        const {data}=await axiosInstance.get("/borrow/my-books")
        if(data.success){
            setStudentsBooks(data.borrowedBooks)
        }
        
    } catch (error) {
        console.log("error to fetch books",error);
    }
  }
  // Fetch Students
  const fetchStudents=async()=>{
    try {
        const {data}=await axiosInstance.get("/admin/students")
        if(data.success){
            setStudents(data.students)
        }
        
    } catch (error) {
        console.log("error to fetch students",error);
    }
  }
  // Fetch All Borrowed books
  const fetchBorrowedBooks=async()=>{
    try {
        const {data}=await axiosInstance.get("/borrow/admin/all")
        if(data.success){
            setBorrowedBooks(data.records)
        }
        
    } catch (error) {
        console.log("error to fetch borrowed books",error);
    }
  }
    useEffect(()=>{
        fetchUser()
    },[])

    useEffect(()=>{
        if(user?.role === "student"){
            fetchBooks();
            fetchStudentDashboardStats();
            fetchStudentBooks();
        }
    },[user])

    useEffect(()=>{
        if(isAdmin){
            fetchAdminDashboardStats();
                            fetchBooks();
              fetchStudents();
                fetchBorrowedBooks();
        }
    },[isAdmin])
    const value={loading,setLoading,user,setUser,navigate,adminStats,fetchAdminDashboardStats,books,fetchBooks,students,fetchStudents,borrowedBooks,fetchBorrowedBooks,studentStats,fetchStudentDashboardStats,studentsBooks,fetchStudentBooks}
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export default AppContextProvider