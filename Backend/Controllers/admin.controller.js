import User from "../model/user.model.js";
import Borrow from "../model/borrow.model.js";

//ALL student 
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

//single student
export const getSingleStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

//Delete Controller
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const activeBorrows = await Borrow.countDocuments({
      student: student._id,
      status: "borrowed",
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete student because they still have borrowed books",
      });
    }

    await student.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};