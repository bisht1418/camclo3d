import React from "react";
import { Link } from "react-router-dom";
import productData from "../../../utils/products.json";

const ProductListingPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-[#f8f8f8]">
      <div className="flex items-center flex-col gap-[50px]">
        <p className="text-secondary font-[600] text-[35px]">Products</p>
        <div className="flex gap-[40px] items-center">
          {productData.map((item) => (
            <Link key={item.productId}
              to={`/product/${item.productId}`}
              className="p-[30px] shadow-lg bg-white rounded-[20px] relative max-w-xs overflow-hidden bg-cover bg-no-repeat cursor-pointer select-none"
            >
              <img className="h-[400px]" src={item.thumbnailImage} />
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full flex justify-center items-center overflow-hidden bg-[#00000050] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                <p className="text-[30px] font-[600] text-white">
                  {item.productName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
