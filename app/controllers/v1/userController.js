const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { default: axios } = require("axios");

// Create a new user
exports.userRegister = async (req, res) => {
  const { firstName, lastName, email, specialist, password, personalPhoto } =
    req.body;

  let emailLowerCase = email.toLowerCase();
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: emailLowerCase });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdDate = new Date();
    const user = new User({
      firstName,
      lastName,
      email: emailLowerCase,
      password: hashedPassword,
      createdDate,
      personalPhoto,
      specialist,
      courses : []
    });

    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mah881999@gmail.com", // Your gmail email address
        pass: "aghm jwap cheh wcap", // Your pass email password
      },
    });

    // Define email data
    let textMessage = `Welcome ${firstName} ${lastName} to Surboone E-Learning `;
    const mailOptions = {
      from: "mah881999@gmail.com",
      to: emailLowerCase,
      subject: "Surboone E-Learning",
      text: textMessage,
    };

      // Send the email
      transporter.sendMail(mailOptions,async (error, info) => {
        if (error) {
          console.error("Error sending email: " + error);
        } else {
          await user.save().then(async (user) => {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
              return res.status(401).json({ error: "Invalid credentials" });
            }
      
            const token = jwt.sign(
              { userId: user._id },
              "0a3f4c10b827cced2e5e8f45f3f3d14b2dd634f3c1558055b0b51e43dcecbade"
            );
            
            return res.status(200).json({
              token,
              firstName,
              lastName,
              email: emailLowerCase,
              password: hashedPassword,
              createdDate,
              personalPhoto,
              specialist,
              user_id: user._id,
            });
          });
        }
      });
 
  } catch (error) {
    console.log("error", error);
    console.log("error", error.resposne);
    res.status(500).json({ error: "Failed to register user" });
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let emailLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailLowerCase });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.isDeleteAccount) {
      return res.status(422).json({ error: "User Delete Account", code: 1 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "0a3f4c10b827cced2e5e8f45f3f3d14b2dd634f3c1558055b0b51e43dcecbade"
    );
    return res.status(200).json({
      token,
      user_id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      personalPhoto: user.personalPhoto,
      specialist: user.specialist,
      courses: user.courses
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to log in" });
  }
};
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Users");
  }
};

// Get a single user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching user");
    });
};

// Delete a User
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.findByIdAndDelete(userId, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting user");
    } else if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  });
};

// update a user
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const courseID = req.body.courseID;
  const email = req.body.email;

  try {    
    let emailLowerCase = email.toLowerCase()
    const userData = await User.findById(userId)
    let userCourse = userData.courses
    let newUserCourse = [...userCourse, courseID]
    console.log('newUserCourse :>> ', newUserCourse);
    console.log('courseID :>> ', courseID);
    if (userCourse.includes(courseID)) {
      return res.status(404).json({ error: "course exists" });
    }
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, {courses : newUserCourse}, {
      new: true,
    });

    const resVeido = await axios.get(
      `http://127.0.0.1:1338/api/play-lists/${courseID}`
    );
    const dataPlayLists = resVeido?.data;

    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mah881999@gmail.com", // Your gmail email address
        pass: "aghm jwap cheh wcap", // Your pass email password
      },
    });

    // Define email data
    let textMessage = `Congratulations, you have successfully signed up for the ${dataPlayLists.title} course`;
    const mailOptions = {
      from: "mah881999@gmail.com",
      to: emailLowerCase,
      subject: "Subscribe to a course",
      text: textMessage,
    };

    transporter.sendMail(mailOptions,async (error, info) => {
      if (error) {
        console.error("Error sending email: " + error);
      } else {
        res.json(updatedUser);
      }
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating user field" });
  }
};

// Reset Password

function generateRandomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

function generateRandomNumber(length) {
  let randomNumber = "";
  for (let i = 0; i < length; i++) {
    randomNumber += Math.floor(Math.random() * 10).toString();
  }
  return randomNumber;
}

function generateRandomCharacter() {
  const specialCharacters = "!@#$%^&*";
  const randomIndex = Math.floor(Math.random() * specialCharacters.length);
  return specialCharacters.charAt(randomIndex);
}

function generateRandomPassword() {
  const randomString = generateRandomString(6);
  const randomNumber = generateRandomNumber(2);
  const randomCharacter = generateRandomCharacter();

  return randomString + randomCharacter + randomNumber;
}

exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  let emailLowerCase = email.toLowerCase();
  try {
    const randomPassword = generateRandomPassword();
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: emailLowerCase });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found", code: -6 });
    }
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const updatedDate = new Date();
    await User.updateOne(
      { email: emailLowerCase },
      {
        password: hashedPassword,
        updatedDate: updatedDate,
      }
    );

    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587, // The default SMTP port for Microsoft 365
      secure: false, // true for 465, false for other ports
      auth: {
        user: "info@sewara-jo.com", // Your Microsoft 365 email address
        pass: "sewara@12312300", // Your Microsoft 365 email password
      },
    });

    // Define email data
    let textMessage = `
    Hello from Sewara Team 
    your new password is : ${randomPassword}
    `;
    const mailOptions = {
      from: "info@sewara-jo.com",
      to: emailLowerCase,
      subject: "Sewara Team",
      text: textMessage,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: " + error);
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message: "Email sent & password reset successful",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed in reset password" });
  }
};

exports.changePassword = async (req, res) => {
  const saltRounds = 10;
  const { currentPassword, newPassword, user_id } = req.body;

  const user = await User.findById(user_id);
  console.log("user", user);
  if (!user) {
    res.status(404).send("User not found");
  }
  let updatedDate = new Date();
  const currentPasswordHash = user.password;
  bcrypt.compare(currentPassword, currentPasswordHash, (err, result) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Incorrect current password.", code: -6 });
    } else if (result) {
      // Current password is correct, generate a new password hash for the new password.
      bcrypt.hash(newPassword, saltRounds, async (err, newHash) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "somthing went wrong", code: -6 });
        } else {
          const updatedUser = await User.findByIdAndUpdate(
            user_id,
            {
              password: newHash,
              updatedDate: updatedDate,
            },
            {
              new: true,
            }
          );
          if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          }
          res.status(200).json({ message: "Password updated successfully." });
        }
      });
    } else {
      // Current password is incorrect.
      console.log("Incorrect current password.");
      res.status(400).json({ message: "Current Password does not match." });
    }
  });
};
