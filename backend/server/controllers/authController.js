import {User} from "../../database/model.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;  // How much salt to use for bcrypt




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
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        })
        // Give them an access token
        const accessToken = jwt.sign({ userId: user.userId }, process.env.JWT_ACCESS_SECRET, {expiresIn: "15m"})
        // And a refresh token
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"})
        // Create access token (stores securely in client cookie) 
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        // Create refresh token for refreshing the session (stores securely in client cookie) 
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {username, email, userId: user.userId},
        });

      } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
      }
    },

    loginUsername: async (req, res) => {
      try {
        const { username, password } = req.body;
        
        const user = await User.findOne({
            where: {username}
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        // Generate accesss token
        const accessToken = jwt.sign(
            {userId: user.userId},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: "15m"},
        );
        // Generate refresh token
        const refreshToken = jwt.sign(
            {userId: user.userId},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d"},
        );

        // Save access token in cookie (stores securely in client cookie) 
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        // Save refresh token for refreshing the session (stores securely in client cookie) 
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({
            success: true,
            message: "Login successful"
        });
      } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: error.message
        });
      }
    },

    // loginEmail: async (req, res) => {},

    logout: async (req, res) => {
        try {
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
            });
            res.status(200).json({
                success: true,
                message: "Logged out succussfully"
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                message: "Server error during logout"
            })
        }
    },

    refresh: async (req, res) => {
        try {
            const refreshToken = req.cookie.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: "No refresh token provided"
                })
            }
            
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
            const user = await User.findOne({ where: {userId: decoded.userId} })
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid refresh token",
                })
            }

            const newAccessToken = jwt.sign(
                {userId: user.userId},
                process.env.JWT_ACCESS_SECRET,
                {expiresIn: "15m"}
            );

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV = "production",
                sameSite: "Strict",
                maxAge: 15 * 60 * 1000,
            });
            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
  };
  
  export default authController;