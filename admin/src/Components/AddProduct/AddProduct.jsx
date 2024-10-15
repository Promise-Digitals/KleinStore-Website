import React from 'react';
import './AddProduct.css';
import upload_icon from '../../assets/upload-icon.png'
import { useState } from 'react';

const AddProduct = () => {

    const [image, setImage] = useState(false);

    const imageHandler = (e) => {
        setImage(e.target.files[0])
    }

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input type="text" name='name' placeholder='Type here'/>
            </div>
            <div className="addproduct-price">
                <div className="addproducts-itemfield">
                    <p>Price</p>
                    <input type="text" name='old-price' placeholder='Type here'/>
                </div>
                <div className="addproducts-itemfield">
                    <p>Offer Price</p>
                    <input type="text" name='new-price' placeholder='Type here'/>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select name="category" className='add-product-selector'>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-thumbnail-img">
                <label htmlFor="file-input">
                    {image ? 
                        <img src={URL.createObjectURL(image)} alt="" className='uploaded-image'/>
                        : 
                        <img src={upload_icon} alt="" className='upload-image-icon'/>
                    }
                    
                </label>
                <input type="file" name="image" id="file-input" hidden onChange={imageHandler}/>
            </div>
            <button className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct;
