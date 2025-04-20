const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  // Đăng ký tài khoản
  register: async (req, res) => {
    try {
      const { username, email, password, name, gender, dob } = req.body;

      // Kiểm tra dữ liệu bắt buộc
      if (!username || !email || !password || !name || !gender || !dob) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
      }

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ." });
      }

      // Kiểm tra độ dài mật khẩu
      if (password.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
      }

      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng." });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        name,
        gender,
        dob
      });

      await newUser.save();

      return res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server." });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Kiểm tra đầu vào
      if (!email || !password) {
        return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email không tồn tại." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng." });
      }

      // Tạo token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d  "
      });

      return res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          gender: user.gender,
          dob: user.dob
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server." });
    }
  },

  logout: async (req, res) => {
    try {
      res.status(200).json({ message: "Đăng xuất thành công!" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server khi đăng xuất." });
    }
  }
  
};
