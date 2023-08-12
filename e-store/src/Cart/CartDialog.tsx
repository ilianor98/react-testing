import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CartItem {
  quantity: number;
  img: string;
  name: string;
  price: number;
}

interface CartDialogProps {
  onClose: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({ onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Retrieve user_id from localStorage
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      // Fetch cart items from the backend
      const fetchCartItems = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/cart', {
            headers: {
              'X-User-Id': userId,
            },
          });
          setCartItems(response.data);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      };

      fetchCartItems();
    }
  }, [userId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-black text-center">Your Cart</h2>
        <table className="w-full text-black">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td className='text-center'>{item.name}</td>
                <td>
                  <img src={item.img} alt={item.name} className="max-w-20 h-auto" />
                </td>
                <td className='text-center'>{item.quantity}</td>
                <td className='text-center'>${Number(item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='text-black flex font-bold'>
          <h2>Total:</h2>
          <h2>test</h2>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CartDialog;
