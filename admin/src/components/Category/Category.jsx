import React, { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import './Category.css'

const Category = () => {

    const categoryForm = useRef();
    console.log(categoryForm)

    const { createdCategory, setCreatedCategory } = useState(false);
    
    
    const userAuthTroughServer = (serverRoute, formData) =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData).then(({data})=>{
            toast.success("Category created successfully")
        }).catch(({response})=>{
            toast.error(response.data.error)
        })
    }
    
    const handleSubmit = (e) => {
        let serverRoute = 'addcategory'
        e.preventDefault();
        let form = new FormData(categoryForm.current)
        let formData = {}

        for(let [key,value] of form.entries()){
            formData[key] = value
        }
        console.log(formData)

        let { name,image } = formData   
        if(name.length < 4){
            return toast.error("Name must be at least 4 characters long")
        }
        userAuthTroughServer(serverRoute, formData)
    }

  return (
    <div className='add-category'>
        <Toaster reverseOrder />
        <div className="text">
            <h2>Add Category</h2>
        </div>
        <div className="add-category-card">
            <p className='bi'>Basic Information</p>
            <form ref={categoryForm}>
                <div className="input">
                    <label htmlFor="name">Category Name:</label>
                    <input name='name' type="text" id='name' placeholder='Enter Category Name' />
                </div>
                <div className="input">
                    <label htmlFor="image">Category Image URL:</label>
                    <div className="leftside-input">
                        <p>https://</p>
                        <input name='image' type="text" id='image' placeholder='Enter Category Image URL' />
                    </div>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default Category
