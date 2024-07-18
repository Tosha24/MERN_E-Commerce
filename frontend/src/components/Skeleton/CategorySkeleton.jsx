import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center min-w-fit">
      <Skeleton circle={true} height={90} width={90} />
      <Skeleton width={80} />
    </div>
  );
};

export default CategoryCardSkeleton;
