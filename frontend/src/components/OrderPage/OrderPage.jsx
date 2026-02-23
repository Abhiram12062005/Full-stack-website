  import React, { useContext, useEffect, useRef, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './OrderPage.css'; // Create and style this file as needed
  import { useCart } from '../../context/CartContext';
  import AddressForm from '../AddAddress/AddAddress'; // Create this component if needed
  import { UserContext } from '../../App';
  import bin from '../../assets/bin.png';
  import axios from 'axios';
  import { Toaster,toast } from 'react-hot-toast';

  const OrderPage = () => {
    const bankForm = useRef();
    const contactusForm = useRef();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");
    const [addAddress, setAddress] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const { userAuth } = useContext(UserContext);
    const userId = userAuth ? userAuth._id : null;

    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
      if (userId) {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN +`/get-addresses/${userId}`)
          .then((res) => setAddresses(res.data.data))
          .catch((error) => console.error('Error fetching addresses:', error));
      }
    }, [userId]);

    const deleteAddress = (addressId) => {
      if (userId) {
        axios.delete(import.meta.env.VITE_SERVER_DOMAIN +`/delete-address/${userId}/${addressId}`)
          .then(() => setAddresses(addresses.filter(address => address._id !== addressId)))
          .catch((error) => console.error('Error deleting address:', error));
      }
    };

    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }, []);

    let subtotal = cart.reduce((sum, product) => sum + (product.productWeight * product.offerprice * product.quantity * 6), 0);
    subtotal = Math.round(subtotal)
    const shippingFee = 0;
    const totals = subtotal + shippingFee;
    const total = Math.ceil(totals)
    console.log(total)

    const userAuthThroughServer = (serverRoute, formData) => {
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(() => {
          toast.success("Order placed successfully");
          navigate('/confirmed-order');
        })
        .catch(({ response }) => {
          toast.error(response.data.error);
        });
    };
    let quantity = null;
    cart.map((e)=>{
      quantity = e.quantity
    })
    console.log(quantity)
    const handleRazorpayPayment = async () => {
      
      const orderData = { userId, addressId: selectedAddress, paymentMethod: 'online', totalAmount: total, cart, quantity };

      try {
        const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/create-order-card', orderData);
        const options = {
          key: 'rzp_test_A9SPOLwh2GZDnb',
          amount: data.amount.toString(),
          currency: data.currency,
          name: 'Your Company Name',
          description: 'Payment for Order',
          order_id: data.id,
          handler: async (response) => {
            const paymentData = {
              orderCreationId: data.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const combinedData = { paymentData, orderData };

            try {
              const result = await axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/payment-success', combinedData);
              if (result.data.success) {
                toast.success('Payment Successful');
                navigate('/confirmed-order');
              }
            } catch (error) {
              console.error('Error in payment success handler:', error);
              toast.error('Error processing payment. Please try again.');
            }
          },
          prefill: {
            name: 'UTMOST',
            email: 'sresaiind@gmail.com',
            contact: '8008122557',
          },
          notes: {
            address: 'Sree Sai Industries PlotNo.62,TIF MSME Green Industrial Park,Dandumalkapur,Yadadri Bhuvanagiri Dt, Telangana -508252',
          },
          theme: {
            color: '#000',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error('Error in Razorpay Payment:', error);
        toast.error('Payment Failed. Please try again.');
      }
    };

    const handleSubmit = () => {
      const serverRoute = `/place-order-cash`;
      let form = new FormData(bankForm.current);
      let bankpayment = {};

      for (let [key, value] of form.entries()) {
        bankpayment[key] = value;
      }
      const { neft, amountpaid, paymentid } = bankpayment;
      if (!neft || !amountpaid || !paymentid) {
        toast.error("Please enter the NEFT Details to proceed with Bank");
      } else {
        const orderData = { userId, addressId: selectedAddress, paymentMethod: selectedPayment, totalAmount: total, cart, bankpayment,quantity };
        userAuthThroughServer(serverRoute, orderData);
      }
    };

    console.log(cart.quantity)

    const handlecontactusPayment = () => {
      const serverRoute = `/contact-us`;
      let form = new FormData(contactusForm.current);
      let contactusData = {};

      for (let [key, value] of form.entries()) {
        contactusData[key] = value;
      }
      const { name, mobilenumber, email, requirement, howdoyouknowus } = contactusData;
      if (!name || !mobilenumber || !email || !howdoyouknowus || !requirement) {
        toast.error("Please enter the Contact and Requirement Details to proceed");
      } else {
        const orderData = { contactusData };
        userAuthThroughServer(serverRoute, orderData);
      }
    };

    console.log(selectedPayment)
    const handleOrder = async () => {
      if (!selectedAddress || !selectedPayment) {
        toast.error('Please select an address and payment method');
        return;
      }
      
      if (selectedPayment === 'bank') {
        handleSubmit();
      } else if (selectedPayment === 'card') {
        handleRazorpayPayment();
      } else if (selectedPayment === 'contactus') {
        handlecontactusPayment();
      }
    };


    return (
      <div className="order-page-container">
        <Toaster/>
        <div className="container">
          <div className="order-details">
            <h1>Order Summary</h1>
            <table className="order-table">
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
                {cart.map((product, index) => (
                  <tr key={index} className="order-item">
                    <td className="product-details">
                      <p className="product-name">{product.name}</p>
                    </td>
                    <td>₹{product.price}</td>
                    <td>₹{product.offerprice}</td>
                    <td>₹{Math.round(product.offerprice * product.quantity * product.productWeight * 6)}</td>
                    <td>{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-total">
              <div className="subtotal">
                <p>Subtotal:</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <hr />
              <div className="shipping">
                <p>Shipping Fee:</p>
                <p>₹{shippingFee.toFixed(2)}</p>
              </div>
              <hr />
              <div className="total" style={{color:"#000"}}>
                <p>Total:</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pass onSelectAddress function to Address component */}
        <div className='address'>
          <button onClick={() => setAddress(curr => !curr)}>
            <span>+</span> Add Address
          </button>
          {addAddress && <AddressForm />}
          <div className="display-address">
            {addresses.map((address, index) => (
              <div className='address-cards' key={index}>
                <div className="address-card-a">
                  <div className="checkbox-wrapper-31">
                    <input
                      type="checkbox"
                      id={address.name}
                      checked={selectedAddress === address._id}
                      onChange={() => setSelectedAddress(address._id)}
                    />
                    <svg viewBox="0 0 35.6 35.6">
                      <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                      <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                      <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                    </svg>
                  </div>
                  <label htmlFor={address.name}>
                    <h2>{address.name}</h2>
                    <div className="address-content">
                      <p>+91{address.mobileNumber}</p>
                      <p>{address.addressLine1}</p>
                      <p>{address.addressLine2}, {address.city}, {address.state}, {address.pincode}</p>
                    </div>
                  </label>
                </div>
                <div className="bin">
                  <img
                    src={bin}
                    width={40}
                    alt="Delete"
                    onClick={() => deleteAddress(address._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="payment">
            <h2>Payment Process</h2>
            <div className="payment-option">
              <div className="checkbox-wrapper-31">
                <input type="radio" name="payment" id='cash' onClick={() => setSelectedPayment('bank')} />
                <svg viewBox="0 0 35.6 35.6">
                      <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                      <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                      <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                    </svg>
              </div>
              <label htmlFor="cash">
                <div className="payment-details">
                  <h2>Through Bank (NEFT)</h2>
                  <p>₹{total.toFixed(2)}</p>
                </div>
              </label>
            </div>
            {selectedPayment === 'bank' &&
              <div className="bank">
                <form ref={bankForm}>
                  <input type="text" id='neft' name='neft' placeholder='NEFT id'/>
                  <input type="text" id='amount-paid' name='amountpaid' placeholder='Amount Paid'/>
                  <input type="text" id='payment-id' name='paymentid' placeholder='Payment Id'/>
                </form>
              </div>
            }
            <div className="payment-option">
              <div className="checkbox-wrapper-31">
                <input type="radio" name="payment" id='contactus' onClick={() => setSelectedPayment('contactus')} />
                <svg viewBox="0 0 35.6 35.6">
                  <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                  <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                  <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                </svg>
              </div>
              <label htmlFor="contactus">
                <div className="payment-details">
                  <h2>Contact Us to Order</h2>
                  <p>₹{total.toFixed(2)}</p>
                </div>
              </label>
            </div>
            {selectedPayment === 'contactus' &&
              <div className="contactus">
                <form ref={contactusForm}>
                  <input type="text" name="name" id="name" placeholder='Enter Name' />
                  <input type="tel" name="mobilenumber" id="mobilenumber" placeholder='Enter Mobile Number' />
                  <input type="email" name="email" id="email" placeholder='Enter Email '/>
                  <input type="text" name="requirement" id="requirement" placeholder='Requirement Details ' />
                  <select name="howdoyouknowus" id="howdoyouknowus" >
                    <option value="" disabled selected>How do you know us</option>
                    <option value="friend">Friend</option>
                    <option value="relatives">Relatives</option>
                    <option value="social_media">Social Media</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                  {selectedOption === 'other' && (
                    <input type="text" name="otherDetail" id="otherDetail" placeholder='Please describe how you know us' />
                  )}
                </form>
              </div>
            }
            <div className="payment-option">
              <div className="checkbox-wrapper-31">
                <input type="radio" name="payment" id='card' onClick={() => setSelectedPayment('card')} />
                <svg viewBox="0 0 35.6 35.6">
                  <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                  <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                  <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                </svg>
              </div>
              <label htmlFor="card">
                <div className="payment-details">
                  <h2>Credit/Debit Card</h2>
                  <p>₹{total.toFixed(2)}</p>
                </div>
              </label>
            </div>
            {selectedPayment &&
              <button className="order-button" onClick={handleOrder}>Place Order with {selectedPayment}</button>
            }
          </div>

      </div>
    );
  };

  export default OrderPage;
