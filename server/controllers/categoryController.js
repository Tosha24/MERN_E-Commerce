import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const existingCategory = await Category.findOne({ name });
    if (existingCategory)
      return res.status(400).json({ message: "Category already exists" });

    const category = await new Category({ name, image }).save();
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, image } = req.body;
    const { categoryId } = req.params;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.name = name;
    category.image = image;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getTotalProductByCategory = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    const categories = await Category.find({});
    console.log("products", products);
    console.log("categories", categories);
    const totalProductsByCategory = categories.map((category) => {
      return {
        _id: category._id,
        name: category.name,
        totalProducts: products.filter(
          (product) =>
            product.category._id.toString() === category._id.toString()
        ).length,
        image: category.image,
        createdAt: category.createdAt,
      };
    });

    totalProductsByCategory.sort((a, b) => a.createdAt - b.createdAt);
    res.status(200).json(totalProductsByCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getTotalProductByCategory,
};
