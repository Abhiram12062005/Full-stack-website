import React, { useState } from 'react';
import './CustomerCare.css'; // Make sure to add your styles

const CustomerCare = ({heading}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [query, setQuery] = useState('');
  const [howDoYouKnow, setHowDoYouKnow] = useState('');
  const [otherInput, setOtherInput] = useState('');

  // Handle changes in the dropdown
  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setHowDoYouKnow(value);
    if (value !== 'Other') {
      setOtherInput(''); // Clear "Other" input if not "Other"
    }
  };

  // Handle changes in the "Other" input field
  const handleOtherInputChange = (event) => {
    setOtherInput(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    // Prepare the data to send
    const formData = {
      name,
      email,
      mobileNumber,
      query,
      howDoYouKnow: howDoYouKnow === 'Other' ? otherInput : howDoYouKnow,
    };
    console.log(formData)

    // Send data to backend
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'/customer-care', { // Replace with your backend endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        // You might want to reset the form or show a success message here
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error scenario
      });
  };

  return (
    <div className='Customer-care'>
      <h1>{heading? heading : "Customer Care"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <input
            type="text"
            placeholder='Enter your Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder='Enter your Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder='Enter your Mobile Number'
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder='Enter your Requirement/Query'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="dropdown-container">
            <select
              id="howDoYouKnow"
              value={howDoYouKnow}
              onChange={handleDropdownChange}
            >
              <option value="">How did you know us?</option>
              <option value="Friends">Friends</option>
              <option value="Family">Family</option>
              <option value="Social Media Platform">Social Media Platform</option>
              <option value="Other">Other</option>
            </select>

          </div>
            {howDoYouKnow === 'Other' && (
              <input
                type="text"
                placeholder='Please specify'
                value={otherInput}
                onChange={handleOtherInputChange}
              />
            )}
          <button className='submit-btn' type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerCare;
