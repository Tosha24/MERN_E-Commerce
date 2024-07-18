import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center relative h-[300px] sm:h-[400px] rounded-lg bg-gray-100/80 p-8 shadow-slate-200 shadow-lg">
      <div className="flex flex-col justify-center items-center ">
        <Skeleton circle={true} height={144} width={144} />

        <Skeleton
          height={20}
          width={180}
          className="text-base sm:text-[18px] w-full md:w-[220px] text-center mt-2 mb-2"
        />
        <div className="flex flex-col md:flex-row !justify-between items-center w-full mt-4 sm:mt-10 pl-4 pr-4 gap-3">
          <Skeleton
            height={20}
            width={100}
            className="text-base sm:text-[18px] text-center mt-2 mb-2"
          />

          <Skeleton
            height={20}
            width={100}
            className="text-base sm:text-[18px] text-center mt-2 mb-2"
          />
        </div>
      </div>
      <div className="absolute top-0 right-[2px] cursor-pointer">
        <Skeleton circle={true} height={14} width={14} />
      </div>
      <div className="absolute bottom-2 right-5 cursor-pointer"></div>
    </div>
  );
};

export default ProductCardSkeleton;
