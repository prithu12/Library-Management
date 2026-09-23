import Book from "../model/book.model.js";
import Borrow from "../model/borrow.model.js";

import {v2 as cloudinary} from "cloudinary";


export const createBook = async (req, res) => {
    try{
        const {title, description, category, language,totalCopies,availableCopies} = req.body;
        if(!title || !description || !category || !language || !totalCopies || !availableCopies){
            return res.status(400).json({message:"Please provide all required fields",success:false});
        }
        if(!req.file){
            return res.status(400).json({message:"Please provide a cover image",success:false});
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "library_management",
        });
        console.log(result,"result cloudinary");
        const book = await Book.create({
            title,
            description,
            category,
            language,
            coverImage: {
                public_id: result.public_id,
                url: result.secure_url,
            },
            totalCopies,
            availableCopies,
            addedBy: "admin",
        });
        return res.status(201).json({message:"Book created successfully",book,success:true});
    }catch(error){
        return res.status(500).json({message:"Error creating book",error:error.message});
    }
};

//GET ALL BOOKS+SEARCH
export const getAllBooks = async (req, res) => {
    try {
        const {keyword, category, language,available} = req.query;
        let query = {};
        if(keyword){
            query.title = { $regex: keyword, $options: "i" };
        }
        if(category) {
            query.category = category;
        }
        if(language) {
            query.language = {$regex:`^${language}$`,$options:"i"};
        }
        if(available==true) {
            query.availableCopies = {$gt:0};
        }
        if(available==false) {
            query.availableCopies = {$eq:0};
        }
        const books = await Book.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ message: "Books fetched successfully", books, success: true });

    }catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
}

//Single Book
export const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

// DELETE BOOK

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const activeBorrow = await Borrow.exists({
      book: book._id,
      status: "borrowed",
    });

    if (activeBorrow) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete book because it is currently borrowed by a student",
      });
    }

    await book.deleteOne();

    if (book.coverImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(book.coverImage.public_id);
      } catch (cleanupError) {
        console.error("Failed to delete book cover from Cloudinary", cleanupError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error: error.message,
    });
  }
};


// ADMIN DASHBOARD STATS

export const getAdminDashboardStats=async(req,res)=>{
  try {

    const totalBooks=await Book.countDocuments();
    const totalBorrowedRecords=await Borrow.countDocuments();
    const borrowedBooksCount = await Borrow.countDocuments({ status: "borrowed" });
    const returnedBooksCount = await Borrow.countDocuments({ status: "returned" });

const books = await Book.find();
 const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
    const availableCopies = books.reduce((sum, book) => sum + book.availableCopies, 0);

    const recentBorrows=await Borrow.find()
    .populate("student","name email")
    .populate("book","title category")
    .sort({createdAt:-1})
    .limit(5)
  return res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        totalCopies,
        availableCopies,
        borrowedBooksCount,
        returnedBooksCount,
        totalBorrowedRecords,
      },
      recentBorrows,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard data ",
      error: error.message,
    });
  }
}