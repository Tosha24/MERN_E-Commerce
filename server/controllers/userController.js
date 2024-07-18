import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";
import crypto from "crypto";


const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    const user = await newUser.save();
    const verificationToken = generateVerificationToken(); // Generate a verification token
    user.verificationToken = verificationToken;
    await user.save();
    // await sendVerificationEmail(user.email, verificationToken); // Send the verification email
    generateToken(res, user._id);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Invalid user data");
  }
});

function generateVerificationToken() {
  const token = crypto.randomBytes(20).toString('hex');
  return token;
}

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(400);
    throw new Error("User does not exist");
  }
  if (!existingUser.isEmailVerified) {
    res.status(400);
    throw new Error("Email not verified");
  }
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  generateToken(res, existingUser._id);
  res.status(200).json(existingUser);
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0, httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.username = req.body.username ? req.body.username : user.username;
  user.email = req.body.email ? req.body.email : user.email;
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
  }
  const updatedUser = await user.save();
  generateToken(res, updatedUser._id);
  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
  });
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot delete admin user");
  }
  await user.deleteOne({ id: user._id });
  res.status(200).json({ message: "User deleted" });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  console.log(req.body.username);
  user.username = req.body.username ? req.body.username : user.username;
  user.email = req.body.email ? req.body.email : user.email;
  user.isAdmin = req.body.isAdmin ? req.body.isAdmin : user.isAdmin;
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

const addProductToFavorites = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const isProductInFavorites = await user.favorites.find(
      (favorite) => favorite.toString() === productId.toString()
    );

    if (isProductInFavorites) {
      res.status(400);
      throw new Error("Product already in favorites");
    }
    user.favorites.push(productId);
    await user.save();
    res.status(200).json({ message: "Product added to favorites" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Find user by verification token
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    res.status(400);
    throw new Error("Invalid verification token");
  }

  // Update user status to indicate email is verified
  user.isEmailVerified = true;
  user.verificationToken = undefined; // Remove verification token
  await user.save();

  // Redirect user to login page
  res.status(200).json({ message: "Email verified successfully" });
});


const removeProductFromFavorites = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const isProductInFavorites = await user.favorites.find(
      (favorite) => favorite.toString() === productId.toString()
    );

    if (!isProductInFavorites) {
      res.status(400);
      throw new Error("Product not in favorites");
    }

    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() != productId.toString()
    );

    await user.save();
    res.status(200).json({ message: "Product removed from favorites" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

const getUserFavorites = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites").exec();
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json(user.favorites);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// Cart controllers
const addAndUpdateProductToCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const objProductId = new mongoose.Types.ObjectId(productId);

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity should be a positive integer" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingProductIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingProductIndex !== -1) {
      user.cart[existingProductIndex].quantity = quantity;
    } else {
      user.cart.push({ product: objProductId, quantity });
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "cart.product",
      model: "Product",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = user.cart || [];
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartId } = req.body;

    if (!cartId) {
      return res.status(400).json({ error: "Cart ID to remove is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.cart || user.cart.length > 0) {
      user.cart = user.cart.filter(
        (item) => item?._id?.toString() !== cartId?.toString()
      );

      await user.save();
    }

    res
      .status(200)
      .json({ message: "Product removed from cart successfully", user });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

const clearCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.cart = [];

    await user.save();

    res.status(200).json({ message: "Cart cleared successfully", user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUser,
  updateCurrentUser,
  deleteUserById,
  getUserById,
  updateUserById,
  addProductToFavorites,
  removeProductFromFavorites,
  getUserFavorites,
  addAndUpdateProductToCart,
  getUserCart,
  removeProductFromCart,
  clearCart,
  generateVerificationToken,
  generateToken,
  verifyEmail,
};
