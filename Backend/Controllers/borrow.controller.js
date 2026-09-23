import Borrow from "../model/borrow.model.js";
import Book from "../model/book.model.js";

// BORROW BOOK

export const borrowBook=async(req,res)=>{
    try {
        if(req.user.role !=="student"){
            return res.status(403).json({
        success: false,
        message: "Only students can borrow books",
      });  
    }
      const {bookId,dueDate}=req.body;
       if (!bookId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Book ID and due date are required",
      });
    }

    const due=new Date(dueDate)

if (isNaN(due.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }
    if (due <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date must be in the future",
      });
    }

    const book=await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: "Book is out of stock",
      });
    }

     const alreadyBorrowed = await Borrow.findOne({
      student: req.user.id,
      book: bookId,
      status: "borrowed",
    });

 if (alreadyBorrowed) {
      return res.status(400).json({
        success: false,
        message: "You have already borrowed this book and not returned it yet",
      });
    }
 const activeBorrowCount = await Borrow.countDocuments({
      student: req.user.id,
      status: "borrowed",
    });
 if (activeBorrowCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "Borrow limit reached. You can only borrow up to 3 books at a time",
      });
    }

     const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gte: 1 } },
      { $inc: { availableCopies: -1 } },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(400).json({
        success: false,
        message: "Book is out of stock",
      });
    }
    const borrow = await Borrow.create({
      student: req.user.id,
      book: bookId,
      dueDate,
    });
return res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      borrow,
    });
       
    } catch (error) {
          return res.status(500).json({
      success: false,
      message: "Failed to borrow book",
      error: error.message,
    });
    }
}

// RETURN BOOK


export const returnBook=async(req,res)=>{
    try {
         const { borrowId } = req.body;
         
    if (!borrowId) {
      return res.status(400).json({
        success: false,
        message: "Borrow ID is required",
      });
    }

        const borrowRecord = await Borrow.findById(borrowId);
         if (!borrowRecord) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    if (borrowRecord.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Book already returned",
      });
    }

     if (borrowRecord.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only return your own borrowed books",
      });
    }
 const book = await Book.findById(borrowRecord.book);

  if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
          borrowRecord.status = "returned";
    borrowRecord.returnedAt = new Date();
    await borrowRecord.save();

      book.availableCopies += 1;
    await book.save();
    return res.status(200).json({
      success: true,
      message: "Bnedook retur successfully",
      borrowRecord,
    });
   
    } catch (error) {
        return res.status(500).json({
      success: false,
      message: "Failed to return book",
      error: error.message,
    });
    }
}

// GET MY BORROWED BOOKS
export const getMyBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Borrow.find({ student: req.user.id })
      .populate("book")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: borrowedBooks.length,
      borrowedBooks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrowed books",
      error: error.message,
    });
  }
};

// GET ALL BORROW RECORDS (ADMIN)
export const getAllBorrowRecords = async (req, res) => {
  try {
    const records = await Borrow.find()
      .populate("student", "name email")
      .populate("book", "title category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrow records",
      error: error.message,
    });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access this dashboard",
      });
    }

    const studentId = req.user.id;

    const totalBorrowed = await Borrow.countDocuments({ student: studentId });

    const currentlyBorrowed = await Borrow.countDocuments({
      student: studentId,
      status: "borrowed",
    });

    const returnedBooks = await Borrow.countDocuments({
      student: studentId,
      status: "returned",
    });

    const recentActivity = await Borrow.find({ student: studentId })
      .populate("book", "title category coverImage")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalBorrowed,
        currentlyBorrowed,
        returnedBooks,
        recentActivity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student dashboard",
      error: error.message,
    });
  }
};
