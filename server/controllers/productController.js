import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, description, category, quantity, brand } = req.fields;
    console.log(req.fields);

    if (!name || !price || !description || !category || !quantity || !brand) {
      return res.status(400).send("Please fill all fields");
    }

    const product = new Product({ ...req.fields });
    product.populate("category");
    console.log("Product: ", product);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, quantity, brand } = req.fields;
    if (!name || !price || !description || !category || !quantity || !brand) {
      return res.status(400).send("Please fill all fields");
    }
    const product = await Product.findByIdAndUpdate(
      id,
      { ...req.fields },
      { new: true } // return the updated product
    );
    product.populate("category");
    console.log("Propduct: ", product);

    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const { category } = req.query;

    let products = [];
    const CategoryData = await Category.findOne({ name: category });
    if (category) {
      products = await Product.find({ category: CategoryData._id });
    } else {
      products = await Product.find({});
    }
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    product.populate("category");
    console.log("Product aapdu: ", product);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category") //populate in mongoose is like join in sql, it will populate the category field with the category object example {_id: 1, name: "Electronics"} instead of just the id of the category
      .sort({ createdAt: -1 });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send("Product already reviewed");
    }
    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review Added Succefully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(10);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checkedBrands, category, minPrice, maxPrice } = req.body;
    const categoryData = await Category.findOne({ name: category });

    let queryConditions = { category: categoryData._id };

    if (checkedBrands && checkedBrands.length > 0) {
      queryConditions.brand = { $in: checkedBrands };
    }

    if (minPrice > 0 && maxPrice > 0) {
      queryConditions.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice > 0) {
      queryConditions.price = { $gte: minPrice };
    } else if (maxPrice > 0) {
      queryConditions.price = { $lte: maxPrice };
    }

    const filteredProducts = await Product.find(queryConditions);

    console.log(filteredProducts);
    res.json(filteredProducts);
  } catch (error) {
    res.status(404).json({ message: "Server error" });
  }
});

const fetchRandomProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 20 } }]);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});


const getProductByCategory = asyncHandler(async (req, res) => {
  try {
    console.log(req);
    const { category } = req.query;

    const categoryData = await Category.findOne({ name: category });

    const products = await Product.find({ category: categoryData._id });

    console.log(products);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const getBrandsUsingCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.query;

    let brands = [];
    if(!category){
      brands = await Product.find({}).distinct("brand");
    }
    else{
      const categoryData = await Category.findOne({ name: category });

      if (categoryData) {
        brands = await Product.find({
          category: categoryData._id,
        }).distinct("brand");
      } else {
        res.status(404).json({ message: "Category not found" });
      }
    }
    console.log(brands);
    res.json(brands);
  } catch (error) {
    res.status(400).json({ message: "Server error"});
  }
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  getAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  getProductByCategory,
  getBrandsUsingCategory,
  fetchRandomProducts,
};
