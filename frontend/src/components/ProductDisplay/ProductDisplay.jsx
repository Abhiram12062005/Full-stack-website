import React, { useEffect, useState } from 'react';
import './ProductDisplay.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import TotalReview from '../TotalReview/TotalReview'
import add from '../../assets/add.png';
import greeenadd from '../../assets/add_icon_green.png';
import redremove from '../../assets/remove_icon_red.png';
import filter from '../../assets/filter.png';

const ProductDisplay = () => {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(200);
  const [cilckFilter, setCilckFilter] = useState(false);
  const { cart, dispatch } = useCart();

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'/category-list')
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'/product')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
      });
  }, []);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const addToCart = (product) => {
    const productInCart = cart.find(item => item._id === product._id);
    if (productInCart) {
      updateQuantity(product, 1);
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity: 1 } });
    }
  };

  const updateQuantity = (product, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: product._id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { _id: product._id, quantity } });
    }
  };

  const getProductQuantity = (productId) => {
    const product = cart.find(item => item._id === productId);
    return product ? product.quantity : 0;
  };

  const renderValue = (value) => {
    if (value && typeof value === 'object' && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    return value;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star full">&#9733;</span>);
      } else if (hasHalfStar && i === fullStars) {
        stars.push(<span key={i} className="star half">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="star">&#9733;</span>);
      }
    }

    return stars;
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.categoryinProduct;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});


  return (
    <div className='product-display'>
      {/* Filter button and filter section commented out
      <button className='btn-filter' onClick={() => setCilckFilter(curr => !curr)}> 
        <img src={filter} width={20} alt="" /> <p>Filters</p> 
      </button>
      <div className={`filter ${cilckFilter ? "active" : ""}`}>
        <div className="filter-heading">
          <h1>Category</h1>
          <hr />
        </div>
        <div className="types">
          <h2>Type</h2>
          {data.map((e) => (
            <div className="category-types" key={e.category.name}>
              <input
                type="checkbox"
                name={e.category.name}
                id={e.category.name}
                checked={selectedCategories.includes(e.category.name)}
                onChange={() => handleCategoryChange(e.category.name)}
              />
              <label htmlFor={e.category.name}>{e.category.name}</label>
            </div>
          ))}
        </div>
      </div> */}
      

      
      <div className="product-dis">
          {Object.keys(groupedProducts).map((category) => {
            const filteredCategoryProducts = groupedProducts[category].filter((product) => {
              const inCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
              const inPriceRange = renderValue(product.offerprice) <= priceRange;
              return inCategory && inPriceRange;
            });

            return (
              filteredCategoryProducts.length > 0 && (
                <div key={category} className="category-section">
                  <div className="casement-heading">
                    <h1>{category}</h1>
                  </div>
                  <hr className='left-hr' />
                  <div className="product-list">
                    {filteredCategoryProducts.map((e) => {
                      let percentage = 100 - (renderValue(e.offerprice) / renderValue(e.price)) * 100;
                      let quantity = getProductQuantity(e._id);
                      let averageRating = calculateAverageRating(e.reviews);
                      let finalprice = e.offerprice * quantity * e.productWeight * 6;
                      finalprice = Math.round(finalprice);
                      return (
                        <div className="product-card-1" key={e._id}>
                          <div className="product-image-1">
                            <img src={import.meta.env.VITE_SERVER_DOMAIN + `/${e.image}`} alt={e.name} />
                          </div>
                          <div className="product-details-1">
                            <h3><Link to={`/products/${e._id}`} className='title'>{e.name}</Link></h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            );
          })}
        </div>
    </div>
  );
};

export default ProductDisplay;