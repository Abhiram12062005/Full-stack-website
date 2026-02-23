import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App'; // Adjust the path based on your project structure
import { Toaster } from 'react-hot-toast';
import './OrderTracking.css'; // Import the CSS styles

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { userAuth } = useContext(UserContext);
  const userId = userAuth ? userAuth._id : null;

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = () => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +`/user-orders/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((response) => {
        console.log('Fetched Orders Response:', response);

        // Adjust based on your response structure
        const orders = Array.isArray(response) ? response : response.data || [];

        setOrders(orders.map(order => ({
          ...order,
          deliveryStatus: order.DeliveryStatus || 'Order Not Confirmed'
        })));
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      });
  };

  const getTrackingStatusClass = (order, stage) => {
    const stages = ['Order Not Confirmed', 'Order Confirmed', 'Packed', 'Shipped', 'Delivered'];
    const currentStageIndex = stages.indexOf(order.deliveryStatus);
    const stageIndex = stages.indexOf(stage);
    return stageIndex <= currentStageIndex ? 'order-tracking completed' : 'order-tracking';
  };

  return (
    <div className="container">
      <Toaster />
      {error && <p>Error: {error}</p>}
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.orderId}>
            <div className="order-card-head">
              <h2>Order ID: {order.orderId}</h2>
            </div>
            <table>
              <tbody>
                <tr>
                  <th>Total Amount</th>
                  <td>₹{order.totalAmount}</td>
                </tr>
                <tr>
                  <th>Payment Type</th>
                  <td>{order.paymentType}</td>
                </tr>
                <tr>
                  <th>Payment Status</th>
                  <td>{order.paymentStatus}</td>
                </tr>
                <tr>
                  <th>Delivery Status</th>
                  <td>{order.deliveryStatus}</td>
                </tr>
              </tbody>
            </table>

            <h3>Ordered Products:</h3>
            <div className="products-card">
                {order.items.map(item => (
                    <div className="product-item" key={item._id}>
                        <img src={import.meta.env.VITE_SERVER_DOMAIN +`/${item.image}`} alt={item.name} />
                        <div className='product-item-details'>
                            <p><strong>{item.name}</strong></p>
                            <p>₹{item.offerprice} x {order.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="address-card">
              <h4>Shipping Address:</h4>
              {order.address && (
                <div className="add">
                  <p>{order.address.name}</p>
                  <p>{order.address.mobileNumber}</p>
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                  <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                </div>
              )}
            </div>

            <div className="row justify-content-between">
              {['Order Not Confirmed', 'Order Confirmed', 'Packed', 'Shipped', 'Delivered'].map((stage) => (
                <div
                  key={stage}
                  className={getTrackingStatusClass(order, stage)}
                >
                  <span className="is-complete"></span>
                  <p style={{color:"#fff"}}>{stage}<br /><span>{/* Optional Date */}</span></p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderTracking;
