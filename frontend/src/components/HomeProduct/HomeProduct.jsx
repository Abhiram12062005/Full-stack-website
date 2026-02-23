import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomeProduct.css';
import rating from '../../assets/rating.png';
import add from '../../assets/add.png';
import { useCart } from '../../context/CartContext';
import greenAdd from '../../assets/add_icon_green.png';
import redRemove from '../../assets/remove_icon_red.png';
import TotalReview from '../TotalReview/TotalReview'


const HomeProduct = () => {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryClick, setCategoryClick] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [viewMoreClickCount, setViewMoreClickCount] = useState(0);
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'/category-list', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'CustomerData');
        setData(data.data);
      });
  }, []);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'/product', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'ProductData');
        setProducts(data.data);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    setCategoryClick((prev) => (prev === categoryName ? '' : categoryName));
    setVisibleCount(3);
    setViewMoreClickCount(0);
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

  const filteredProducts = categoryClick
    ? products.filter((product) => product.categoryinProduct === categoryClick)
    : products;

  const handleViewMore = () => {
    if (viewMoreClickCount === 0) {
      setVisibleCount((prevCount) => prevCount + 3);
      setViewMoreClickCount(1);
    } else {
      navigate('/product');
    }
  };

  return (
    <div className="hp-home-product">
      <div className="hp-home-product-category">
        <div className="hp-txt">
          <h1>Explore Our Window Profiles</h1>
          <p className='text-hide'>
            Choose from a diverse range of window profiles featuring exceptional designs crafted with the finest materials and advanced technology. Our mission is to enhance your living space and improve your comfort, one superior window at a time.
          </p>
        </div>
        <div className="hp-show-category">
          {data.map((e, index) => (
            <div
              onClick={() => handleCategoryClick(e.category.name)}
              key={index}
              className="hp-category-card"
            >
              <img
                width={80}
                height={80}
                className={categoryClick === e.category.name ? 'hp-active' : ''}
                src={e.category.image}
                alt=""
              />
              <p>{e.category.name}</p>
            </div>
          ))}
        </div>
        <hr className="hp-hr-cat" />
      </div>
      <div className="hp-home-product-products">
        <div className="hp-product-card">
          {filteredProducts.slice(0, visibleCount).map((e, index) => {
            let percentage = 100 - (renderValue(e.offerprice) / renderValue(e.price)) * 100;
            let quantity = getProductQuantity(e._id);
            let finalprice = e.offerprice * quantity * e.productWeight * 6
            finalprice = Math.round(finalprice)
            return (
              <div className="hp-prod" key={index}>
                <div className="hp-product-img">
                  <img src={import.meta.env.VITE_SERVER_DOMAIN +`/${e.image}`} alt="" />
                </div>
                <div className="hp-product-details">
                  <div className="hp-product-heading">
                  <h3><Link style={{color:"#000"}} to={`/products/${e._id}`} className='title'>{e.name}</Link></h3>
                  </div>
                  <div className="hp-below-card">
                    {/* <div className="hp-product-pricing">
                      <div className="hp-pricing">
                        <h2>₹{renderValue(e.offerprice)}</h2>
                        <div className="hp-pricing1">
                          <sub>
                            <del>₹{renderValue(e.price)}</del>
                          </sub>
                          <p>({percentage.toFixed(2)}%)</p>
                        </div>
                      </div>
                      {
                        quantity ? <h4>₹{finalprice.toFixed(2)}</h4> : ""
                      }
                      <TotalReview productId={e._id} color={"black"} />
                    </div> */}
                    {/* <div className="hp-add-btn">
                      {quantity === 0 ? (
                        <img
                          className="hp-black-add"
                          src={add}
                          height={35}
                          onClick={() => addToCart(e)}
                        />
                      ) : (
                        <div className="hp-quantity-controls">
                          <img
                            src={redRemove}
                            height={35}
                            onClick={() => updateQuantity(e, quantity - 1)}
                          />
                          <span>{quantity}</span>
                          <img
                            src={greenAdd}
                            height={35}
                            onClick={() => updateQuantity(e, quantity + 1)}
                          />
                        </div>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {visibleCount < filteredProducts.length && (
          <button className='hp-view-more' onClick={handleViewMore}>
            {viewMoreClickCount === 0 ? 'View More' : 'Explore Menu'}
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeProduct;
