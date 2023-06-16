const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res.status(422).json({ message: "User already exists!" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed, please try again later." });
  }

  if (!existingUser) {
    return res.status(401).json({ message: "User not found !!" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ message: "Invalid credentials, could not log you in." });
  }
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "30s",
  });

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 30 * 1000),
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Sucessfully logged in", user: existingUser, token });
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  console.log(token);
  //   const headers = req.headers["authorization"];
  //   const token = headers && headers.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(user.id);
    req.id = user.id;
  });
  next();
};

const getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ message: user });
};

exports.login = login;
exports.signup = signup;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
