import React from 'react';
import './AddProduct.css';
import upload_icon from '../../assets/upload-icon.png'
import { useState } from 'react';

const AddProduct = () => {

    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "men",
        old_price: "",
        new_price: "",
    })

    const imageHandler = (e) => {
        setImage(e.target.files[0])
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value})
    }

    const addProduct = async() => {
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product' , image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => {responseData = data})

        if(responseData.success){
            product.image = responseData.image_url
        }


        await fetch('http://localhost:4000/addProduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        }).then((resp) => resp.json()).then((data) => {
            data.success ? alert("Product Added") : alert("Operation Failed")
        })
    }

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here'/>
            </div>
            <div className="addproduct-price">
                <div className="addproducts-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here'/>
                </div>
                <div className="addproducts-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here'/>
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
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
            <button className='addproduct-btn' onClick={()=>{addProduct()}}>ADD</button>
        </div>
    )
}

export default AddProduct;
