import React from 'react';
import './Cartitems.css';
import { useCart } from '../../context/CartContext';
import greeenadd from '../../assets/add_icon_green.png';
import redremove from '../../assets/remove_icon_red.png';
import { Link } from 'react-router-dom';

const CartItems = () => {
  const { cart, dispatch } = useCart();

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { _id: productId, quantity } });
  };

  // Helper function to safely render values
  const renderValue = (value) => {
    if (value && typeof value === 'object' && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    return typeof value === 'number' ? value : parseFloat(value);
  };

  // Calculate subtotal
  let subtotal = cart.reduce((sum, product) => sum + (product.offerprice * product.quantity * product.productWeight * 6), 0);
  subtotal = Math.round(subtotal)
  const shippingFee = 0; // Fixed shipping fee
  const total = subtotal + shippingFee;

  return (
    <div className="custom-cart-container">
      {cart.length === 0 ? (
        <p className="custom-empty-cart-message">Your cart is empty</p>
      ) : (
        <>
          <table className="custom-cart-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Offer Price</th>
                <th>Total Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product, index) => {
                // Remove the product if quantity is zero
                if (product.quantity === 0) {
                  removeFromCart(product._id);
                  return null; // Skip rendering
                }

                return (
                  <tr key={index} className="custom-cart-item">
                    <td className='custom-product-details'>
                      <p className="custom-product-name">{product.name}</p>
                    </td>
                    <td>₹{renderValue(product.price).toFixed(2)}</td>
                    <td>₹{renderValue(product.offerprice).toFixed(2)}</td>
                    <td>₹{(Math.round(product.offerprice * product.quantity * product.productWeight * 6)).toFixed(2)}</td>
                    <td>
                      <div className="custom-quantity-controls">
                        <img
                          src={redremove}
                          height={25}
                          onClick={() => updateQuantity(product._id, product.quantity - 1)}
                          alt="Remove"
                        />
                        <span>{product.quantity}</span>
                        <img
                          src={greeenadd}
                          height={25}
                          onClick={() => updateQuantity(product._id, product.quantity + 1)}
                          alt="Add"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="total">
            <div className="subtotal">
              <p>Subtotal: </p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="subtotal">
              <p>Shipping Fee: </p>
              <p>₹{shippingFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="subtotal">
              <p>Total: </p>
              <p>₹{total.toFixed(2)}</p>
            </div>
            <hr />
            <div className="orderbtn">
            <Link to={'/order'}><button className="order-now-button">Order Now</button></Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
