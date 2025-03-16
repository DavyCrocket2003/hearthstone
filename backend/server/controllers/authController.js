import {User} from "../../database/model.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




const authController = {
    register: async (req, res) => {
      try {
        const { username, email, password } = req.body;
        
        // Check if email already exists
        const userWithEmail = await User.findOne({
            where: {email},
        })
        if (userWithEmail) {
            return res.status(409).json({
                success: false,
                message: "Email is in use",
            })
        }
        // Check if username already exists
        const userWithUsername = await User.findOne({
            where: {username}
        })
        if (userWithUsername) {
            return res.status(409).json({
                success: false,
                message: "Username is in use",
            });
        }
        // Ready to generate a new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        })



        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    login: async (req, res) => {
      try {
        const { username, password } = req.body;
        // Login logic
        res.status(200).json({ message: 'Login successful' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    // Add more methods here as needed
  };
  
  export default authController;