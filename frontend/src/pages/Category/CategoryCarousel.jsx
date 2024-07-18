import React from "react";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import CategoryCard from "./CategoryCard";
import CategoryCardSkeleton from "../../components/Skeleton/CategorySkeleton.jsx";


const CategoryCarousel = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <>
      <div className="w-screen flex flex-row space-x-8 mt-4 ml-32 mr-32 p-4 overflow-x-scroll scrollbar-hide">
        {isLoading
          ? Array.from({ length: 15 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : categories.map((category, index) => (
              <CategoryCard
                index={index}
                key={category._id}
                name={category.name}
                image={category.image}
              />
            ))}
      </div>
    </>
  );
};

export default CategoryCarousel;
