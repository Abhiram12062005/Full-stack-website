import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import arrow from '../../assets/right-up.png';
import { Link } from 'react-router-dom';
import backarrow from '../../assets/left-arrow.png';
import './Searchcomponent.css'; // Create and style this file as needed

const Searchcomponent = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 0) {
      fetch(import.meta.env.VITE_SERVER_DOMAIN +`/search?query=${query}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setSuggestions(data);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`); // Adjust this route based on your routing setup
  };

  return (
    <div className="search-container">
      <div className="search">
        <Link to={'/'}><img src={backarrow} alt="" /></Link>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="search-input"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((product) => (
            <div className="sugesstion-card" key={product._id}>
              <img src={arrow} alt="" />
              <li
                onClick={() => handleSuggestionClick(product._id)}
                className="suggestion-item"
              >
                {product.name}
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchcomponent;
