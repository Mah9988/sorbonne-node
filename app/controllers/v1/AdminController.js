const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Create a new user
exports.adminRegister = async (req, res) => {
  const { name, email, phoneNumber, password, country } = req.body;
  try {
    // Check if the email already exists in the database
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdDate = new Date();
    const user = new Admin({
      name,
      email,
      password: hashedPassword,
      createdDate,
      updatedDate: createdDate,
    });
    await user.save().then(async (user) => {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id },
        "0a3f4c10b827cced2e5e8f45f3f3d14b2dd634f3c1558055b0b51e43dcecbade"
      );
      return res.status(200).json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "0a3f4c10b827cced2e5e8f45f3f3d14b2dd634f3c1558055b0b51e43dcecbade"
    );
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to log in" });
  }
};
// Get all users
exports.getAllAdmins = async (req, res) => {
  try {
    const users = await Admin.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Admins");
  }
};

// Get a single user by ID
exports.getAdminById = (req, res) => {
  const userId = req.params.id;

  Admin.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send("Admin not found");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching admin");
    });
};
// check admin token
exports.checkToken = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token.replace('Bearer ', ''), '0a3f4c10b827cced2e5e8f45f3f3d14b2dd634f3c1558055b0b51e43dcecbade', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Token is valid, you can perform additional checks here if needed

    return res.json({ message: 'Token is valid' });
  });
};


