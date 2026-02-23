import React, { useContext, useRef, useState } from 'react'
import './ProductReview.css'
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const ProductReview = () => {
    const authform = useRef();
    const { id } = useParams();
    const [rating, setRating] = useState(0)
    const { userAuth } = useContext(UserContext);
    const userId = userAuth ? userAuth._id : null;

    const userAuthTroughServer = (serverRoute, formData) =>{
        if(userId){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData).then(({data})=>{
                toast.success("Review Added Successfully")
                window.location.reload();
            }).catch(({response})=>{
                toast.error(response.data.error)
            })
        } else {
            toast.error("please login to reivew")
        }
    }

    

    const handleSubmit = (e) => {
        let serverRoute = `/product-review/${id}/${userId}`;
        e.preventDefault();
        let form = new FormData(authform.current)
        let formData = {rating}

        for(let [key,value] of form.entries()){
            formData[key] = value
        }
        console.log(formData)

        let { comment } = formData;
        userAuthTroughServer(serverRoute, formData)
    }

    return (
        <div className="review-container">
            <Toaster/>
            <div className="comment">
                <form ref={authform}>
                    <textarea name='comment' placeholder='Leave a Comment' id="" required></textarea>
                </form>
            </div>
            <div className='stars-review'>
            {[1, 2, 3, 4, 5].map((star) => {
                return (  
                <span
                    className='start'
                    style={{
                    cursor: 'pointer',
                    color: rating >= star ? 'gold' : 'gray',
                    fontSize: `35px`,
                    }}
                    onClick={() => {
                    setRating(star)
                    }}
                >
                    {' '}
                    ★{' '}
                </span>
                )
            })}
            </div>
            <button className='review-submit' onClick={handleSubmit}>Submit Comment</button>
        </div>
    )
}

export default ProductReview
