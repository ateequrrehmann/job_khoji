import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message: "User created successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error ${error}`,
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email and password",
                success: false
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect email and password",
                success: false
            })
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with this role",
                success: false
            })
        }

        const tokenData = {
            userId: user._id,
        }

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            userData,
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error ${error}`,
            success: false
        })
    }
}


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error ${error}`,
            success: false
        })
    }
}



export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        //file yahan aaye gi

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; //from middleware 

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        //data update

        let count = 0;
        if (fullname) {
            user.fullname = fullname;
            count += 1;
        }

        if (email) {
            user.email = email;
            count += 1;
        }

        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
            count += 1;
        }

        if (bio) {
            user.profile.bio = bio;
            count += 1;
        }

        if (skills) {
            user.profile.skills = skillsArray;
            count += 1;
        }
        //resume left
        if (count > 0) {
            await user.save();

            user = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            }

            return res.status(200).json({
                message: "Profile updated successfully",
                user,
                success: true
            })
        }

        else {
            return res.status(400).json({
                message: "No data to update",
                success: false
            })
        }


    } catch (error) {
        return res.status(500).json({
            message: `Internal server error ${error}`,
            success: false
        })
    }
}