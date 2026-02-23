import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { Link, useNavigate } from 'react-router-dom';
import menu from '../../assets/dots.png';

const ProductList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER_DOMAIN +'product', { method: 'GET' });
      const result = await response.json();
      console.log(result, 'ProductData');
      setData(result.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(import.meta.env.VITE_SERVER_DOMAIN +`product/${id}`, { method: 'DELETE' });
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const updateProduct = (id) => {
    navigate(`/update-product/${id}`)
    console.log(`Update product with ID: ${id}`);
  };

  const renderValue = (value) => {
    if (value && typeof value === 'object' && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    return value;
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className='product-list-container'>
      <table className='product-list'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Offer Price</th>
            <th>Weight</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => (
            <tr key={e._id}>
              <td>
                <Link to={`/product/${e._id}`} className="product-name">
                  <img src={import.meta.env.VITE_SERVER_DOMAIN +`${e.image}`} width={40} height={40} alt={e.name} />
                  <span>{e.name}</span>
                </Link>
              </td>
              <td>{e.categoryinProduct}</td>
              <td>{renderValue(e.price)}</td>
              <td>{renderValue(e.offerprice)}</td>
              <td>{renderValue(e.productWeight)}</td>
              <td>{renderValue(e.countInStock)}</td>
              <td>
                <div className="dropdowns">
                  <img 
                    src={menu}
                    alt="menu"
                    className="dropdown-toggle"
                    onClick={() => toggleDropdown(e._id)}
                  />
                  {openDropdown === e._id && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item" onClick={() => updateProduct(e._id)}>Update</div>
                      <div className="dropdown-item" onClick={() => deleteProduct(e._id)}>Delete</div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
