import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import './UpdateProduct.css';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productForm = useRef();
  const [data, setData] = useState(null);
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

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_DOMAIN +`products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data); // Set the fetched product data
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  const userAuthThroughServer = (serverRoute, formDatas) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formDatas, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(({ data }) => {
        toast.success("Product updated successfully");
        setTimeout(() => {
            navigate('/product-list')
          }, 1000);        
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
    if (selectedImage) {
      form.append('image', selectedImage);
    }

    userAuthThroughServer(`updateproduct/${id}`, form);
  };

  return (
    <div className='add-category'>
      <Toaster reverseOrder />
      <div className="text">
        <h2>Update Product</h2>
      </div>
      <div className="add-category-card">
        <p className='bi'>Basic Information</p>
        {data && (
          <form ref={productForm} onSubmit={handleSubmit}>
            <div className="input">
              <label htmlFor="name">Product Name:</label>
              <input
                name='name'
                type="text"
                id='name'
                placeholder='Enter Product Name'
                defaultValue={data.name}
              />
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
              <input
                name='description'
                maxLength={5000}
                type="text"
                id='description'
                placeholder='Enter Product Description'
                defaultValue={data.description}
              />
            </div>
            <div className="input">
              <label htmlFor="category">Product Category:</label>
              <select
                name="categoryinProduct"
                id="category"
                defaultValue={data.categoryinProduct}
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map(category => (
                  <option key={category.category._id} value={category.category.name}>
                    {category.category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input">
              <label htmlFor="productWeight">Product Weight:</label>
              <input
                name='productWeight'
                type="text"
                id='productWeight'
                placeholder='Enter Product Weight'
                defaultValue={data.productWeight}
              />
            </div>
            <div className="input">
              <label htmlFor="offerPrice">Product Offer Price:</label>
              <input
                name='offerprice'
                type="number"
                id='offerPrice'
                placeholder='Enter Product Offer Price'
                defaultValue={data.offerprice}
              />
            </div>
            <div className="input">
              <label htmlFor="price">Product Price:</label>
              <input
                name='price'
                type="number"
                id='price'
                placeholder='Enter Product Price'
                defaultValue={data.price}
              />
            </div>
            <div className="input">
              <label htmlFor="count">Product Count:</label>
              <input
                name='countInStock'
                type="number"
                id='count'
                placeholder='Enter Product Count'
                defaultValue={data.countInStock}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
