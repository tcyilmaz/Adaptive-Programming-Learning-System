const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  //Validation, add more complex later
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username, email, and password" });
  }

  try {
    //Check if user already exists
    const userExists = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }

    //Hash Pass
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    //Insert New User
    const newUser = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, email, username",
      [username, email, passwordHash]
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;


  //Validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
        // --- Find User by Email ---
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0]; // <<---- DİKKAT: Eğer kullanıcı bulunamazsa, 'user' undefined olur!

        if (!user) {
            // Kullanıcı bulunamadıysa, buradan erken çıkış yapılır ve aşağıdaki kod çalışmaz.
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // --- Compare Passwords ---
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            // Parola eşleşmezse, buradan erken çıkış yapılır.
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // --- Generate JWT ---
        // MUHTEMEL HATA KAYNAĞI BURASI VEYA ÇOK YAKINI (61. satır civarı)
        const payload = {
            user: { // Eğer 'user' objesi (yukarıdan gelen) undefined ise, user.user_id hata verir.
                id: user.user_id,       // <<---- Eğer 'user' undefined ise, user.user_id hata verir!
                email: user.email,
                username: user.username,
                // role: user.role // eğer rol varsa
            },
        };

        
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
      (err, token) => {
        if (err) throw err;
        const { password_hash, ...userInfo } = user;
        res.status(200).json({
          message: "Login successful!",
          token: token,
          user: userInfo,
        });
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


const getMyProfileController = async (req, res) => {
    try {
        // req.user objesi 'protect' middleware'i tarafından set edilmiş olmalı
        // ve JWT payload'ındaki user_id'yi içermeli
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User ID not found in token' });
        }

        const userId = req.user.id;
        // Veritabanından kullanıcı bilgilerini çek (parola hash'i hariç)
        const result = await db.query(
            'SELECT user_id, username, email, first_name, last_name, created_at FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length > 0) {
            const userProfile = result.rows[0];
            res.json({ user: userProfile });
        } else {
            res.status(404).json({ message: 'User not found in database' });
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error while fetching profile" });
    }
};
module.exports = {
  registerUser,
  loginUser,
  getMyProfileController,
};
