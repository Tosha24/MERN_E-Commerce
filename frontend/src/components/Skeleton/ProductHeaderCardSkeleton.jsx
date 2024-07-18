import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const ProductHeaderCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center w-auto h-auto sm:h-[350px] rounded-lg p-8 bg-gray-100/80 m-5 ">
      <Skeleton circle={true} height={144} width={144} className="w-3/4 sm:w-[12rem] h-auto sm:h-[12rem] rounded-full" />

      <Skeleton height={20} width={180} className="text-base sm:text-[18px] w-full md:w-[220px] text-center mt-2 mb-2" />

      <Skeleton height={20} width={100} className="text-base sm:text-[18px] text-center mt-2 mb-2" />
    </div>
  );
};

export default ProductHeaderCardSkeleton;