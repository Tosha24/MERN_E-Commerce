import React from 'react'
import { useGetUserCartQuery } from '../../redux/api/usersApiSlice';

const CartCount = () => {

    const {data: cartProducts} = useGetUserCartQuery();
  return (
<div className="absolute bottom-0 left-4">
      {cartProducts && (
        <span className="px-1 py-0 text-sm text-white bg-red-500 rounded-full">
          {cartProducts.length || 0}
        </span>
      )}
    </div>
  )
}

export default CartCount