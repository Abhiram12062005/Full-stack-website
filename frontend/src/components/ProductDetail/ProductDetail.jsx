import './ProductDetail.css';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cartimg from '../../assets/shopping-cart.png';
import ProductReview from '../ProductReview/ProductReview';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import dot from '../../assets/dots.png';
import Rating from '../Rating/Rating';
import { UserContext } from '../../App';
import { useCart } from '../../context/CartContext';
import greeenadd from '../../assets/add_icon_green.png';
import redremove from '../../assets/remove_icon_red.png';
import toast, { Toaster } from 'react-hot-toast';

const ProductDetail = () => {
    const readOnly = true;
    const stars = [1, 2, 3, 4, 5];
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [reviewData, setReviewData] = useState(null);
    const [productReview, setProductReview] = useState(false);
    const [dropIndex, setDropIndex] = useState(null); // State to track which dropdown is active
    const { userAuth } = useContext(UserContext);
    const { cart, dispatch } = useCart();
    const userId = userAuth ? userAuth._id : null;

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER_DOMAIN +`/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.data); // Set the fetched product data
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
            });
    }, [id]);

    useEffect(() => {
        if (id) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN +`/product-review/${id}`)
                .then((res) => setReviewData(res.data.data))
                .catch((error) => console.error('Error fetching reviews:', error));
        }
    }, [id]);

    // Function to delete a review
    const deleteReview = (reviewId, reviewUserId) => {
        if(userId == reviewUserId){
            axios.delete(import.meta.env.VITE_SERVER_DOMAIN +`/product-review/${id}/${reviewId}`)
                .then(() => {
                    // Filter out the deleted review from reviewData
                    setReviewData(prevReviewData => prevReviewData.filter(review => review._id !== reviewId));
                    toast.success('Review deleted successfully');
                    window.location.reload();
                    // Optionally, you can keep the dropdown open or closed after deletion
                    setDropIndex(null); // Close dropdown after deletion
                })  
                .catch((error) => {
                    console.error('Error deleting review:', error);
                });
        } else {
            toast.error("You cannot delete other reviews");
        }
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

    // Convert MongoDB Decimal128 to number
    const convertToNumber = (value) => {
        if (value && typeof value === 'object' && value.$numberDecimal) {
            return parseFloat(value.$numberDecimal);
        }
        return value;
    };

    // Toggle dropdown menu for each review card
    const toggleDropdown = (index) => {
        setDropIndex(index === dropIndex ? null : index); // Toggle dropdown for the clicked card
    };

    // Render loading or product details based on data availability
    return (
        <div className='productdetails'><Toaster/>
            {data ? (
                <>
                    {(() => {
                        const percentage = 100 - (convertToNumber(data.offerprice) / convertToNumber(data.price)) * 100;
                        const quantity = getProductQuantity(data._id); // Get the product quantity
                        let finalprice = data.offerprice * quantity * data.productWeight * 6
                        finalprice = Math.round(finalprice)
                        return (
                            <div className="product-details">
                                <div className="product-details-image">
                                    <img src={import.meta.env.VITE_SERVER_DOMAIN +`/${data.image}`} alt="" />
                                </div>
                                <div className="product-details-content">
                                    <h1>{data.name}</h1>
                                     <div className="product-details-pricing">
                                        <span className="offer">₹{convertToNumber(data.offerprice)}</span>
                                        <del className="price">₹{convertToNumber(data.price)}</del>
                                        <span className="price">({percentage.toFixed(2)}% off)</span>
                                    </div>
                                    {
                                        quantity ? <h4 style={{color:"#fff"}}>₹{finalprice.toFixed(2)}</h4> : ""
                                    } 
                                    <div className="product-details-button">
                                        {
                                            quantity === 0 ? (
                                                <button onClick={() => addToCart(data)}>Add to Cart</button>
                                            ) : (
                                                <div className="hp-quantity-control">
                                                    <img
                                                        src={redremove}
                                                        height={35}
                                                        onClick={() => updateQuantity(data, quantity - 1)}
                                                        alt="Remove"
                                                        style={{width:"4vw", height:"4vw"}}
                                                    />
                                                    <span>{quantity}</span>
                                                    <img
                                                        src={greeenadd}
                                                        height={35}
                                                        onClick={() => updateQuantity(data, quantity + 1)}
                                                        alt="Add"
                                                        style={{width:"4vw", height:"4vw"}}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="product-details-description">
                                        <p>{data.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </>
            ) : (
                <p>Loading...</p>
            )}
            <div className="reviews">
                <div className="reviews-add-content">
                    <h2>Review this product</h2>
                    <p>Share your thoughts with other customers</p>
                    <button onClick={() => setProductReview(curr => !curr)}>Write a Product Review</button>
                </div>
                <CSSTransition
                    in={productReview}
                    timeout={300}
                    classNames="product-review"
                    unmountOnExit
                >
                    <ProductReview />
                </CSSTransition>
                <div className="reviews-display">
                    {reviewData ? (
                        reviewData.map((review, index) => (
                            <div key={review._id} className="review-card">
                                <div className="review-card-content">
                                    <img src={review.userId?.profile_img} alt={review.userId?.username || "User"} className="review-user-photo" />
                                    <div className="review-content">
                                        <h3>{review.userId?.username || "Anonymous"}</h3>
                                        <p>{review.date || "Date not available"}</p>
                                    </div>
                                    <div className="menu-img">
                                        <img
                                            src={dot}
                                            width={10}
                                            className='review-menu'
                                            alt=""
                                            onClick={() => toggleDropdown(index)}
                                        />
                                        <div className={`dropdown-menu ${dropIndex === index ? "active" : ""}`}>
                                            <ul>
                                                <li onClick={() => deleteReview(review.id, review.userId?.id)}>Delete</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="comment-content">
                                    <p>{review.comment}</p>
                                    <div className='stars-review'>
                                    {stars.map((star) => (
                                        <span
                                            key={star}
                                            className='star'
                                            style={{
                                                cursor: readOnly ? 'default' : 'pointer',
                                                color: review.rating >= star ? 'gold' : 'gray',
                                                fontSize: '35px',
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet</p>
                    )}
                </div>
            </div> 
        </div>
    );
};

export default ProductDetail;
