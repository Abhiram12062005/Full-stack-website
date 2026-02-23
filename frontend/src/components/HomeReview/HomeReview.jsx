import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Rating from '../Rating/Rating';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./HomeReview.css";

const HomeReview = () => {
    const [reviewData, setReviewData] = useState([]);
    const readOnly = true
    const stars = [1, 2, 3, 4, 5];

    useEffect(() => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN +'/random-reviews')
            .then((res) => {
                if (Array.isArray(res.data.data)) {
                    setReviewData(res.data.data);
                } else {
                    console.error('Unexpected data format:', res.data);
                    toast.error('Unexpected data format');
                }
            })
            .catch((error) => {
                console.error('Error fetching reviews:', error);
                toast.error('Error fetching reviews');
            });
    }, []);

    console.log(reviewData)

    const settings = {
        dots: true,
        infinite: reviewData.length > 1,
        speed: 500,
        slidesToShow: reviewData.length < 2 ? 1 : 2,
        slidesToScroll: reviewData.length < 2 ? 1 : 2,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        responsive: [
            {   
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className='review-containers'>
            <Toaster />
            <h1>Our Customer Reviews</h1>
            <div className="review-slider">
                {reviewData.length > 0 ? (
                    <Slider {...settings}>
                        {reviewData.map((review, index) => (
                            <div key={index} className="review-cards">
                                <div className="card-content">
                                    <img src={review.userImage} alt={review.username} className="user-photo" />
                                    <div className="myCarousel">
                                        <h3>{review.username}</h3>
                                    </div>
                                </div>
                                <div className="comment-contents">
                                    <p>{review.review.comment}</p>
                                    <div className='stars-review'>
                                    {stars.map((star) => (
                                        <span
                                            key={star}
                                            className='star'
                                            style={{
                                                cursor: readOnly ? 'default' : 'pointer',
                                                color: review.review.rating >= star ? 'gold' : 'gray',
                                                fontSize: '35px',
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>No reviews yet</p>
                )}
            </div>
        </div>
    );
};

export default HomeReview;
