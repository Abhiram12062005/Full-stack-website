import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './TotalReview.css';

const TotalReview = ({ productId, color }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!productId) {
      console.error('No productId provided');
      return;
    }
    console.log(color)

    axios.get(import.meta.env.VITE_SERVER_DOMAIN +`/product-review/${productId}`)
      .then((res) => {
        setReviews(res.data.data);
      })
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [productId]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const renderStars = (rating) => {
    const starElements = [];
    for (let i = 0; i < 5; i++) {
      const starFilledWidth = Math.max(0, Math.min(1, rating - i)) * 100;
      starElements.push(
        <div key={i} className="star-container">
          <span className="starss">&#9733;</span>
          <span className="star-filled" style={{ width: `${starFilledWidth}%` }}>&#9733;</span>
        </div>
      );
    }
    return starElements;
  };

  const averageRating = calculateAverageRating(reviews);

  return (
    <div className='product-rating-1'>
      <div className="stars">{renderStars(averageRating)}</div>
      <p className={`length ${color}`}>({reviews.length})</p>
    </div>
  );
};

export default TotalReview;
