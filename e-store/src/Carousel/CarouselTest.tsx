import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CarouselTest: React.FC = () => {
  const maxScrollWidth = useRef<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carousel = useRef<HTMLDivElement | null>(null);
  const [carouselProducts, setCarouselProducts] = useState<any[]>([]); // Adjust the type as per your data structure

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction: 'prev' | 'next'): boolean => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    const fetchCarouselProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/carousel_products'); // Update the URL as needed
        setCarouselProducts(response.data);
        maxScrollWidth.current =
             (carousel.current?.offsetWidth || 0) * (carouselProducts.length - 1);
      } catch (error) {
        console.error('Error fetching carousel products:', error);
      }
    };

    fetchCarouselProducts();
  }, []);

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  return (
    <div className="carousel my-12 mx-auto">
      <h2 className="text-4xl leading-8 font-semibold mb-12 text-white text-center">
        Check out these products!
      </h2>
      <div className="relative overflow-hidden">
        <div className="flex justify-between absolute top-0 left-0 w-full h-full">
          <button
            onClick={movePrev}
            className="carousel-button hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('prev')}
          >
            {/* SVG for Previous button */}
          </button>
          <button
            onClick={moveNext}
            className="carousel-button hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('next')}
          >
            {/* SVG for Next button */}
          </button>
        </div>
        <div
          ref={carousel}
          className="carousel-container relative flex gap-1 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"
          style={{
            width: '90%', // Adjust the width as needed
            margin: '0 auto', // Center the carousel container
          }}
        >
          {carouselProducts.map((product: any, index: number) => (
            <div
              key={index}
              className="carousel-item text-center relative w-96 h-96 snap-start" // Adjust the width and height as needed
            >
              <a
                href={`/product/${product.id}`}
                className="h-full w-full aspect-square block bg-origin-padding bg-left-top bg-cover bg-no-repeat z-0"
                style={{ backgroundImage: `url(${product.img || ''})` }}
              >
                <img
                  src={product.img || ''}
                  alt={product.name}
                  className="w-full aspect-square hidden"
                />
              </a>
              <a
                href={`/product/${product.id}`}
                className="h-full w-full aspect-square block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-blue-800/75 z-10"
              >
                <h3 className="text-white py-6 px-3 mx-auto text-xl">
                  {product.name}
                </h3>
                <h3 className="text-white py-6 px-3 mx-auto text-xl">
                  {product.price}
                </h3>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default CarouselTest;
