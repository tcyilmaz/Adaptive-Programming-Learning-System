// backend/controllers/authController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PGCRYPTO_KEY = process.env.PGCRYPTO_KEY; // Bu kalsın, getMyProfileController kullanıyor

const registerUser = async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body; // first_name, last_name alınıyor

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username, email, and password" });
  }

  // PGCRYPTO_KEY kontrolü bu test için kalabilir, çünkü getMyProfileController bunu kullanıyor.
  // Eğer bu test sırasında registerUser'da pgcrypto kullanmayacaksak, bu kontrolü registerUser özelinde atlayabiliriz.
  // Ama şimdilik kalsın, bir zararı yok.
  // if (!PGCRYPTO_KEY) {
  //   console.error('CRITICAL: PGCRYPTO_KEY is not set in environment variables.');
  //   return res.status(500).json({ message: 'Server configuration error due to missing encryption key.' });
  // }

  try {
    const userExists = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // --- TEST 1: first_name ve last_name'i NULL olarak ekleyen, şifrelemesiz INSERT ---
    console.log("TEST 1: Attempting insert with first_name and last_name as NULL, no encryption.");
    const insertQuery = `
        INSERT INTO users (
            username, email, password_hash,
            first_name, last_name 
        ) VALUES (
            $1, $2, $3,
            NULL, NULL       -- first_name ve last_name'i direkt NULL yapıyoruz
        ) RETURNING user_id, email, username;
    `;

    const params = [
        username,       // $1
        email,          // $2
        passwordHash,   // $3
        // first_name veya last_name için parametre yok, sorguda direkt NULL yazdık
    ];

    console.log("TEST 1 - SQL Query:", insertQuery);
    console.log("TEST 1 - SQL Params:", params);

    const newUser = await db.query(insertQuery, params);
    // --- SON TEST 1 ---

    res.status(201).json({
      message: "User registered successfully (Test 1 - names as NULL)!",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Registration Error (Test 1 - names as NULL):", error);
    res.status(500).json({
        message: "Server error during registration (Test 1 - names as NULL)",
        errorDetails: error.message,
        errorCode: error.code,
        errorPosition: error.position
    });
  }
};

// loginUser ve getMyProfileController fonksiyonları olduğu gibi kalacak (önceki tam çalışan halleriyle)
// ÖNEMLİ: getMyProfileController'ın pgp_sym_decrypt(first_name::BYTEA, ...) kullandığından
// ve first_name/last_name sütunlarının BYTEA olduğundan emin olmalısınız.
// Bu testten sonra registerUser'ı şifrelemeli hale geri döndüreceğiz.

const loginUser = async (req, res) => {
  // ... (Bir önceki mesajdaki tam loginUser kodu) ...
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const result = await db.query(
        'SELECT user_id, username, email, password_hash, points, created_at, updated_at FROM users WHERE email = $1',
        [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    const payload = {
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
      (err, token) => {
        if (err) {
            console.error("JWT Sign Error:", err);
            return res.status(500).json({ message: 'Error generating token' });
        }
        const userInfoToSend = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            points: user.points,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
        res.status(200).json({
          message: "Login successful!",
          token: token,
          user: userInfoToSend,
        });
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login", errorDetails: error.message });
  }
};

const getMyProfileController = async (req, res) => {
  if (!PGCRYPTO_KEY) {
    console.error('CRITICAL: PGCRYPTO_KEY is not set in environment variables for profile fetching.');
    return res.status(500).json({ message: 'Server configuration error due to missing encryption key.' });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User ID not found in token (middleware issue)' });
    }

    const userId = req.user.id;
    const queryText = `
        SELECT
            user_id, username, email, points, created_at, updated_at,
            CASE
                WHEN first_name IS NOT NULL THEN pgp_sym_decrypt(first_name::BYTEA, $2::TEXT)
                ELSE NULL
            END AS first_name,
            CASE
                WHEN last_name IS NOT NULL THEN pgp_sym_decrypt(last_name::BYTEA, $2::TEXT)
                ELSE NULL
            END AS last_name
        FROM users
        WHERE user_id = $1;
    `;
    const result = await db.query(queryText, [userId, PGCRYPTO_KEY]);

    if (result.rows.length > 0) {
      const userProfile = result.rows[0];
      res.json({ user: userProfile });
    } else {
      res.status(404).json({ message: 'User not found in database' });
    }
  } catch (error) {
    console.error("Error fetching or decrypting user profile:", error);
    res.status(500).json({
        message: "Server error while fetching profile",
        errorDetails: error.message,
        errorCode: error.code,
        errorPosition: error.position
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getMyProfileController,
};