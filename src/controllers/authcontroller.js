const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (password !== user.password)
      return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
