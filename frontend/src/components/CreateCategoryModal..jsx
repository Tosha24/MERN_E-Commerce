import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateCategoryMutation } from "../redux/api/categoryApiSlice";

const CreateCategoryModal = ({ isOpen, onClose, refetch }) => {
  const [image, setImage] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [createCategory] = useCreateCategoryMutation();

  const handleCreateCategory = async () => {
    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }
    if (!image) {
      toast.error("Category image is required");
      return;
    }

    const category = {
      name: categoryName,
      image,
    };

    try {
      await createCategory(category).unwrap();
      toast.success("Category created successfully");
      setCategoryName("");
      setImage("");
      refetch();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
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
          toast.success("Image uploaded successfully");
        } else if (error) {
          toast.error(error?.data?.message || error.error);
        }
      }
    );
  };

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleInputClick = (e) => {
    // Prevent the click event from propagating to the modal background
    e.stopPropagation();
  };

  return (
    <div
      className={`flex justify-center items-center h-[100vh] w-[100vw]  p-2 rounded-xl z-[500px] fixed top-0 left-0  ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className="flex flex-col justify-center items-center bg-white p-4 rounded-xl w-[600px] z-10"
        onClick={handleInputClick}
      >
        <h1 className="text-2xl font-bold text-black mb-4">Create Category</h1>
        <hr
          className="w-full border-2 border-white mb-4"
          style={{ height: "1px" }}
        ></hr>
        <div className="flex flex-col justify-center items-center mb-4">
          <div className="flex flex-row gap-2 justify-center items-center mb-2">
            <label htmlFor="categoryName" className="text-black">
              Category Name:
            </label>
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border-2 border-black rounded-md p-2 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {image && (
            <img
              src={image}
              alt="Uploaded Category"
              className="w-32 h-32 object-cover rounded-full mb-2 border-2 border-blue-400"
            />
          )}
          <button
            className="bg-blue-200 text-black font-semibold p-2 rounded-md hover:bg-gray-200 focus:outline-none"
            onClick={openCloudinaryWidget}
          >
            Upload Image
          </button>

          <button
            className="bg-black text-white font-semibold p-2 rounded-md hover:bg-gray-800 focus:outline-none mt-4 w-full"
            onClick={handleCreateCategory}
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
