import React, { useRef, useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import './ProductAdd.css';

const ProductAdd = () => {
  const productForm = useRef();
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +'category-list', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
      });
  }, []);

  const userAuthThroughServer = (serverRoute, formDatas) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formDatas, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(({ data }) => {
        toast.success("Product created successfully");
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]); // Single file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let form = new FormData(productForm.current);

    userAuthThroughServer('product', form);
  };

  return (
    <div className='add-category'>
      <Toaster reverseOrder />
      <div className="text">
        <h2>Add Products</h2>
      </div>
      <div className="add-category-card">
        <p className='bi'>Basic Information</p>
        <form ref={productForm} onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="name">Product Name:</label>
            <input name='name' type="text" id='name' placeholder='Enter Product Name' />
          </div>
          <div className="input">
            <label htmlFor="images">Product Image:</label>
            <input
              name='image'
              type="file"
              id='images'
              onChange={handleImageChange}
            />
          </div>
          <div className="input">
            <label htmlFor="description">Product Description:</label>
            <input name='description' maxLength={5000} type="text" id='description' placeholder='Enter Product Description' />
          </div>
          <div className="input">
            <label htmlFor="category">Product Category:</label>
            <select name="categoryinProduct" id="category" required>
              <option value="" disabled selected>Select Category</option>
              {categories.map(category => (
                <option key={category.category._id} value={category.category.name}>{category.category.name}</option>
              ))}
            </select>
          </div>
          <div className="input">
            <label htmlFor="productWeight">Product Weight:</label>
            <input name='productWeight' type="text" id='productWeight' placeholder='Enter Product Weight' />
          </div>
          <div className="input">
            <label htmlFor="offerPrice">Product Offer Price:</label>
            <input name='offerprice' type="number" id='offerPrice' placeholder='Enter Product Offer Price' />
          </div>
          <div className="input">
            <label htmlFor="price">Product Price:</label>
            <input name='price' type="number" id='price' placeholder='Enter Product Price' />
          </div>
          <div className="input">
            <label htmlFor="count">Product Count:</label>
            <input name='countInStock' type="number" id='count' placeholder='Enter Product Count' />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProductAdd;
