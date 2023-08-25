import React, { useState } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    img: string;
    price: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-96 h-96 relative bg-cover bg-center bg-no-repeat transition-opacity duration-300"
      style={{
        backgroundImage: `url(${product.img})`,
        opacity: hovered ? 1 : 0.7,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-4 text-white bg-blue-800/75">
          <h3 className="text-xl mb-2">{product.name}</h3>
          <h3 className="text-xl">{product.price} $</h3>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
