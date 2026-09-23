import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../model/user.model.js';
import generateToken from '../utils/Token.js';

dotenv.config();

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  maxAge: 3 * 24 * 60 * 60 * 1000,
};

const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

export const signup = async (req, res) => {
  try {
    const { password } = req.body;
    const name = String(req.body.name ?? '').trim();
    const email = normalizeEmail(req.body.email);
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password', success: false });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long', success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
    });

    const token = generateToken({ id: user._id, role: user.role });
    res.cookie('token', token, cookieOptions);

    return res.status(201).json({
      message: 'Student registered successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password', success: false });
    }

    if (email === normalizeEmail(process.env.ADMIN_EMAIL) && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken({ email: process.env.ADMIN_EMAIL, role: 'admin' });
      res.cookie('token', token, cookieOptions);
      return res.json({
        message: 'Admin logged in successfully',
        user: { email: process.env.ADMIN_EMAIL, role: 'admin' },
        token,
        success: true,
      });
    }

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({ message: 'Email does not exist', success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password', success: false });
    }

    const token = generateToken({ id: userData._id, role: userData.role });
    res.cookie('token', token, cookieOptions);

    return res.json({
      message: 'Student logged in successfully',
      user: { id: userData._id, name: userData.name, email: userData.email, role: userData.role },
      token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ message: 'User logged out successfully', success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging out user', error: error.message });
  }
};
export const profile = async (req, res) => {
    try {
        if(req.user.role === 'admin'){
            return res.status(200).json({user:{email:process.env.ADMIN_EMAIL,role:"admin"}, success: true} );
        }
        const {id}=req.user;
        const user= await User.findById(id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found', success: false });
        }
        return res.status(200).json({ user: user, success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};
export const registerStudent = signup;
export const loginUser = login;
export const logoutUser = logout;