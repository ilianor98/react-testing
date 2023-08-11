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
    userId: string | null; // Change the type to string | null
  }

const CartDialog: React.FC<CartDialogProps> = ({ onClose, userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
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
  }, [userId]);

  return (
    <div className="cart-dialog">
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            <img src={item.img} alt={item.name} width="50" height="50" />
            {item.name} - {item.quantity} x ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CartDialog;
