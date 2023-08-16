import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
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

  function calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  }

  const handleDecreaseQuantity = (item: CartItem) => {
    // Make a POST request to decrease the quantity of the item in the cart
    axios.post('http://localhost:8000/api/remove_one', {
      product_id: item.id,
      user_id: userId,
    }).then((_response) => {
      if (item.quantity > 1) {
        // Update cart items with decreased quantity
        const updatedCartItems = cartItems.map((cartItem) => {
          if (cartItem.id === item.id) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          }
          return cartItem;
        });
        setCartItems(updatedCartItems);
      } else {
        // Remove the item completely from the cart
        const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
        setCartItems(updatedCartItems);
      }
    }).catch((error) => {
      console.error('Error decreasing quantity:', error);
    });
  };

  const handleIncreaseQuantity = (item: CartItem) => {
    // Make a POST request to increase the quantity of the item in the cart
    axios.post('http://localhost:8000/api/add_to_cart', {
      product_id: item.id,
      user_id: userId,
    }).then((_response) => {
      // Update cart items with increased quantity
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.id === item.id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      setCartItems(updatedCartItems);
    }).catch((error) => {
      console.error('Error increasing quantity:', error);
    });
  };

  const handleRemoveCartItem = (item: CartItem) => {
    // Make a POST request to remove the item from the cart
    axios.post('http://localhost:8000/api/remove_item', {
      product_id: item.id,
      user_id: userId,
    }).then((_response) => {
      // Update cart items by filtering out the removed item
      const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
      setCartItems(updatedCartItems);
    }).catch((error) => {
      console.error('Error removing item:', error);
    });
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-3/4 h-3/4 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4 text-black text-center">Your Cart</h1>
        <table className="w-full text-black">
          <thead className='bg-slate-500'>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody className='bg-slate-400'>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td className='text-center text-xl'>{item.name}</td>
                <td>
                <div className="flex items-center justify-center">
                  <img src={item.img} alt={item.name} className="max-w-20 h-20" />
                </div>
                </td>
                <td className='text-center items-center flex justify-center mt-3'>
                  <div className="flex items-center">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDecreaseQuantity(item)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className='text-center'>${Number(item.price).toFixed(2)}</td>
                <td className='text-center'>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleRemoveCartItem(item)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='text-black flex font-bold items-end justify-end'>
          <h2>Total:</h2>
         <h2>${calculateTotal(cartItems).toFixed(2)}</h2>
        </div>
        <div className='flex items-center justify-center'>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
        </div>
      </div>
    </div>
  );
};

export default CartDialog;
