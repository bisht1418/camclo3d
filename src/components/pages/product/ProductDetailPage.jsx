import React, { useState } from "react";
import { useParams } from "react-router-dom";
import productData from "../../../utils/products.json";
import { FaCheck } from "react-icons/fa6";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#00000000");
  const [selectedTexture, setSelectedTexture] = useState("");
  const currentProduct = productData.filter((item) => item.productId === id)[0];
  return (
    <div className="bg-[#f8f8f8]">
      <div className="flex w-full max-w-[1600px] h-screen m-auto">
        <div className="w-1/2 flex justify-center items-center">
          <div className="h-[800px] w-[533px] rounded-[20px] shadow-lg p-[50px] bg-[white] relative overflow-hidden">
            {currentProduct.productId ===
              "acb5ad72-d806-4293-b374-a351c0533807" && (
              <img
                className={`h-[500px] absolute bottom-[-17.2%] left-[30%] rotate-[90deg]`}
                src={selectedTexture.sareeLayer}
              />
            )}
            {currentProduct.productId ===
              "acb5ad72-d806-4293-b374-a351c0533807" && (
              <img
                className={`h-[800px] w-[430px] absolute top-[-2%] left-[7%] rotate-[-30deg]`}
                src={selectedTexture.sareeLayer}
              />
            )}
            {currentProduct.productId ===
              "acb5ad72-d806-4293-b374-a351c0533807" && (
              <img
                className={`h-[200px] w-[320px] absolute top-[11%] left-[4%] rotate-[197deg]`}
                src={selectedTexture.blouseLayer}
              />
            )}
            {currentProduct.productId ===
              "ec952503-1e14-4ea4-a9e4-171dae546323" &&
              selectedTexture.length !== 0 && (
                <img
                  className={`h-[780px] absolute top-[0px] left-[50px]`}
                  src={selectedTexture.layerImage}
                />
              )}
            {currentProduct.customLayers.map((item) => (
              <img
                key={item.id}
                style={{
                  background: item.id === 1 ? selectedColor : "#00000000",
                }}
                className={`h-[800px] absolute top-[0px] left-[0] ${
                  item.id === 2 ? "opacity-[0.3]" : ""
                }`}
                src={item.layerImage}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-[20px] py-[100px] pr-[100px]">
          <p className="text-[35px] text-primary font-[700]">
            {currentProduct.productName}
          </p>
          <p className="text-[25px] text-secondary font-[600]">
            $ {currentProduct.price}
          </p>
          <p className="text-[20px] text-secondary font-[300]">
            {currentProduct.productDescription}
          </p>
          <div>
            <button
              onClick={() => {
                setIsCustomizationOpen(!isCustomizationOpen);
              }}
              className="bg-primary text-white font-[500] p-[10px_25px] rounded-[5px]"
            >
              Customize
            </button>
          </div>
          <>
            {isCustomizationOpen && (
              <div className="p-[30px] bg-[white] shadow-lg rounded-[20px] flex flex-col gap-[20px]">
                <div className="flex items-center gap-[20px]">
                  <label>Choose Color</label>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                    }}
                  />
                </div>
                <div className="relative w-full border-dashed border border-secondary">
                  <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white px-[10px]">
                    OR
                  </div>
                </div>
                <div className="flex flex-col gap-[20px] gap-[20px]">
                  <p>Choose Texture</p>
                  <div className="flex gap-[20px]">
                    {currentProduct.textures.map((item) => (
                      <div className="relative">
                        <label
                          onClick={() => {
                            setSelectedTexture(item);
                            setSelectedColor("#00000000");
                          }}
                          className="h-[50px] w-[50px] cursor-pointer"
                        >
                          <img
                            className="rounded-full"
                            src={item.thumbnailImage}
                          />
                        </label>
                        {selectedTexture === item.layerImage && (
                          <div className="absolute top-[0px] left-[0px] bg-[#00000090] h-[50px] w-[50px] rounded-full flex justify-center items-center">
                            <FaCheck color={"white"} size={25} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
    // <>Product Detail Page</>
  );
};

export default ProductDetailPage;
