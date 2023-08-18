import React, { useState } from 'react';
import axios from 'axios';

interface DeleteProductFormProps {
  onClose: () => void;
}

const DeleteProductForm: React.FC<DeleteProductFormProps> = ({ onClose }) => {
  const [productId, setProductId] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:8000/api/delete_product', {
          product_id: productId,
        });
      
        if (response.status === 200) {
          // Product added successfully, close the form
          onClose();
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error or display error message
      }
      
  };

  return (
    <div className="py-6 px-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Delete Product</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block font-medium text-gray-700">Product ID:</label>
          <input
            type="text"
            id="productName"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteProductForm;
