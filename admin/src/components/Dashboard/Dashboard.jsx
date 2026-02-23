import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import deleteicon from '../../assets/delete.png';

const Dashboard = () => {

  const [data, setData] = useState([]);
  const [userdata, setuserData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_SERVER_DOMAIN +'customer-list');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const datas = await response.json();
        setuserData(datas);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Fetch users initially
    fetchUser();

    // Polling interval (every 10 seconds in this example)
    const interval = setInterval(() => {
      fetchUser();
    }, 10000); // 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_SERVER_DOMAIN +'orders-list');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const datas = await response.json();
        setData(datas);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    // Fetch orders initially
    fetchOrders();

    // Polling interval (every 10 seconds in this example)
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000); // 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once

  // Check if userdata.data is defined and has a length
  const userDataLength = userdata.data ? userdata.data.length : 0;
  console.log(userDataLength);

  let amount = [];
  data.forEach(element => {
    amount.push(element.totalAmount);
  });
  let finalAmount = amount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  let averageAmount = amount.length > 0 ? finalAmount / amount.length : 0;
  console.log(averageAmount);

  return (
    <div className='dashboard-container'>
      <div className="dashboard-metrics">
        <div className="metric-card">
          <h2>Total Sales</h2>
          <p>₹{finalAmount}</p>
        </div>
        <div className="metric-card">
          <h2>Average Order Value</h2>
          <p>₹{averageAmount.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h2>Number of Orders</h2>
          <p>{data.length}</p>
        </div>
        <div className="metric-card">
          <h2>Active Users</h2>
          <p>{userDataLength}</p>
        </div>
      </div>
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => {
              const date = new Date(order.joinedAt);
              const options = {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false, // Use 24-hour format
                timeZone: 'UTC' // Ensure UTC time zone
              };
              let formattedDate = date.toLocaleDateString('en-US', options);
              return (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.user.username}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.DeliveryStatus}</td>
                  <td>{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
