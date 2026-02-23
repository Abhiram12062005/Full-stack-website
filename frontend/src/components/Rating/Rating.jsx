import React, { useState } from 'react'
import './Rating.css'

const Rating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(null);

    return (
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= (hover || rating) ? 'on' : 'off'}
              onClick={() => onRatingChange(index)}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="star">&#9733;</span>
            </button>
          );
        })}
        <span>({rating})</span>
      </div>
    );
}

export default Rating
