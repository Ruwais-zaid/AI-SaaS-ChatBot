import User from "../models/User.js";
import bcrypt from 'bcrypt';
import vine from '@vinejs/vine';
import jwt from 'jsonwebtoken';
import { LoginSchema, registerSchema } from '../validator/authvalidation.js';

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const { name, email, password } = await validator.validate(body);

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      // Create a new user
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      // Send the token and user details
      res.status(201).json({
        message: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(LoginSchema);
      const { email, password } = await validator.validate(body);

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send the token and user details
      res.status(200).json({
        message: "Login successful",
        access_token: `Bearer ${token}`,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all users
  static async getAllUser(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({
        message: "Ok",
        users
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async verifyUser(req,res){
    try {
        const user = req.user; // Assuming authMiddleware sets req.user
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({
          message: "User verified",
          user: { id: user._id, name: user.name, email: user.email }
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }

}

export default AuthController;
