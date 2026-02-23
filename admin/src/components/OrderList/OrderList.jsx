import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN +'orders-list')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log('Fetched Orders Data:', data);
                setOrders(data);
            })
            .catch((err) => {
                console.error('Error fetching orders:', err);
                setError('Failed to fetch orders');
            });
    }, []);

    const handleConfirmOrder = (orderId) => {
        // Make a request to update the order status
        fetch(import.meta.env.VITE_SERVER_DOMAIN +'update-order-status', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                paymentStatus: 'Received', // or however you want to set this
                deliveryStatus: 'Confirmed' // or however you want to set this
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
            // Update local state to reflect changes
            setOrders(orders.map(order =>
                order.orderId === orderId ? { ...order, paymentStatus: 'Received', DeliveryStatus: 'Order Confirmed' } : order
            ));
            toast.sucess("Updated Successfully")
        })
        .catch((err) => {
            console.error('Error updating order:', err);
            setError('Failed to update order');
        });
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
                                    <td>{order.DeliveryStatus}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <h3>Ordered Products:</h3>
                        <div className="products-card">
                            {order.items.map(item => (
                                <div className="product-item" key={item._id}>
                                    <img src={import.meta.env.VITE_SERVER_DOMAIN +`${item.image}`} alt={item.name} />
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

                        {order.paymentType === 'bank' && (
                          <div className="bank">
                            <p>NEFT ID: {order.bankdetails.neft || 'N/A'}</p>
                            <p>Amount Paid: {order.bankdetails.amountpaid || 'N/A'}</p>
                            <p>Payment ID: {order.bankdetails.paymentid || 'N/A'}</p>
                            <button className='co-btn' onClick={() => handleConfirmOrder(order.orderId)}>Confirm Order</button>
                          </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderList;
