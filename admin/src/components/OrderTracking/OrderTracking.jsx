import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './OrderTracking.css'; // Import the CSS styles

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'orders-list')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched Orders Data:', data);
        setOrders(data.map(order => ({
          ...order,
          deliveryStatus: order.DeliveryStatus || 'Order Not Confirmed'
        })));
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'update-order-status-track', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        newStatus,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Order updated:', data);
        setOrders(orders.map(order =>
          order.orderId === orderId ? { ...order, deliveryStatus: newStatus } : order
        ));
        toast.success("Updated Successfully");
      })
      .catch((err) => {
        console.error('Error updating order:', err);
        setError('Failed to update order');
      });
  };

  const getTrackingStatusClass = (order, stage) => {
    const stages = ['Order Not Confirmed', 'Order Confirmed', 'Packed', 'Shipped', 'Delivered'];
    const currentStageIndex = stages.indexOf(order.deliveryStatus);
    const stageIndex = stages.indexOf(stage);
    return stageIndex <= currentStageIndex ? 'order-tracking completed' : 'order-tracking';
  };

  return (
    <div className="container-track">
      <Toaster />
      {error && <p>Error: {error}</p>}
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.orderId}>
            <div className="order-card-head">
              <h2>Order ID: {order.orderId}</h2>
              <p>Name: {order.user.username}</p>
              <p>Email: {order.user.email}</p>
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
                  onClick={() => handleUpdateOrderStatus(order.orderId, stage)}
                >
                  <span className="is-complete"></span>
                  <p>{stage}<br /><span>{/* Optional Date */}</span></p>
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
