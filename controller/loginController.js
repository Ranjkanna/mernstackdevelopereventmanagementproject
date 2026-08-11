const loginSchema = require('../modal/loginSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", email);

      const existingUser = await loginSchema.findOne({
        email: email.toLowerCase().trim(),
      });

      if (!existingUser) {
        return res.status(401).json({ message: "User does not exist" });
      }

      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      console.log("Password match:", passwordMatch);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // ✅ FIXED — token now carries isAdmin so verifyToken can check it
      //    without needing an extra DB lookup on every request
      const token = jwt.sign(
        { id: existingUser._id, isAdmin: existingUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log("Login success:", existingUser.email, "| isAdmin:", existingUser.isAdmin);

      // ✅ FIXED — explicitly include isAdmin in the response.
      //    (existingUser.isAdmin will now actually exist because the schema
      //     declares the field — previously it was silently stripped.)
      return res.status(200).json({
        token,
        user: {
          _id:         existingUser._id,
          fullName:    existingUser.fullName,
          email:       existingUser.email,
          phoneNumber: existingUser.phoneNumber,
          isAdmin:     existingUser.isAdmin || false,
        },
      });

    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: err.message || "Something went wrong" });
    }
  },
};

module.exports = loginController;