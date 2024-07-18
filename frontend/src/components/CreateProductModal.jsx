import React, { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../redux/api/productApiSlice";
import toast from "react-hot-toast";

const CreateProductModal = ({ onClose, isOpen, productId }) => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (productId) {
      setIsUpdate(true);
    }
  }, [ productId]);

  const { data: productData } = useGetProductByIdQuery(productId);
  console.log(productData);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", Number(stock));

      const data = await createProduct(productData).unwrap();

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", Number(stock));
      console.log("Category", category);

      const { data } = await updateProduct({ productId: productId, formData });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`Product successfully updated`);
        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.");
    }
  };

  const openCloudinaryWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: "dh8gfmbp2",
        uploadPreset: "embmj1ia",
        sources: ["local", "url", "camera"],
        cropping: true,
        multiple: false,
        folder: "E-COMMERCE",
        tags: ["Products"],
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Upload Success:", result.info);

          setImage(result.info.secure_url);
          setImageUrl(result.info.secure_url);
          toast.success("Image uploaded successfully");
        } else if (error) {
          toast.error(error?.data?.message || error.error);
        }
      }
    );
  };

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(categories.find((c) => c._id === productData.category)?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setImageUrl(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData, categories]);

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className={`flex justify-center items-center min-h-[100vh] w-[100vw] overflow-y-scroll p-2 rounded-xl z-[500px] fixed top-0 left-0  ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className="flex flex-col justify-start h-[80vh] my-auto items-center bg-white p-4 rounded-xl w-[90%] md:w-[70%] z-10
          overflow-y-scroll
        "
        onClick={handleInputClick}
      >

        <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-black mb-4 w-full">
          {isUpdate ? "Update/Delete Product" : "Add New Product"}
        </h1>
       {/* cross button */}
        <div className="flex justify-end w-full">
          <button
            className="bg-red-500 text-white p-2 h-8 w-8 rounded-md flex justify-center items-center"
            onClick={onClose}
          >
            X
          </button>
        </div>
        </div>

        <div className="flex flex-col justify-center items-center mb-4 w-full">
          {/* create product  */}
          <div className="flex flex-col justify-center items-center mb-4 gap-3 w-full">
            <div className="flex flex-col md:flex-row w-full gap-3 items-start md:items-center justify-between font-semibold">
            <div className="flex flex-col w-full">

              <label htmlFor="name">Name:</label>
              <input
                type="text"
                placeholder="Name"
                className="border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full">

              <label htmlFor="brand">Brand:</label>
              <input
                type="text"
                placeholder="Product Brand"
                className="border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
              </div>
            </div>
            <div className="flex flex-col w-full gap-3 items-start justify-start font-semibold">
              <label htmlFor="description">Description:</label>
              <textarea
                placeholder="Description"
                className="border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              ></textarea>
            </div>

            <div className="flex flex-col md:flex-row w-full gap-3 items-start md:items-center justify-center font-semibold">
            <div className="flex flex-col w-full">
              <label htmlFor="category">Category:</label>
            
              <select
                className="border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                placeholder="Choose Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              </div>
              
              <div className="flex flex-col w-full">
              <label htmlFor="stock">Count In Stock:</label>
              <input
                type="number"
                placeholder="Count in Stock"
                className="border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-3 items-start md:items-center justify-center font-semibold">
            <div className="flex flex-col w-full">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                placeholder="Price"
                className="border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              </div>
              <div className="flex flex-col w-full">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                className="border-2 border-gray-400 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              {imageUrl && (
                <div className="text-center">
                  <img
                    src={imageUrl}
                    alt="product"
                    className="w-[150px] h-[150px] rounded-full"
                  />
                </div>
              )}
              <button
                className="bg-blue-500 text-white p-2 rounded-md min-w-fit"
                onClick={openCloudinaryWidget}
              >
                Upload Image
              </button>
            </div>
            {isUpdate ? (
              <button
                className="bg-rose-400 text-white p-2 rounded-md w-1/2"
                onClick={handleUpdateProduct}
              >
                Update Product
              </button>
            ) : (
              <button
                className="bg-rose-400 text-white p-2 rounded-md w-full"
                onClick={handleCreateProduct}
              >
                Create Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
