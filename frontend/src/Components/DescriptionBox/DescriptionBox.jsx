import React from 'react';
import './DescriptionBox.css'

const DescriptionBox = () => {
    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (122)</div>
            </div>

            <div className="descriptionbox-description">
                <p>An ecommerce website is an online store where customers can find products, browse offerings, and place purchases online. It facilitates the transaction between a buyer and seller. A digital storefront can serve as the virtual equivalent of the product shelves, sales staff, and cash register of a physical shop.</p>

                <p>A clothing brand is a business or label that operates within the fashion industry, specializing in creating and selling clothing and apparel. It encompasses designing, manufacturing, marketing, and distributing garments, targeting specific customer segments or the target market.</p>
            </div>
        </div>
    )
}

export default DescriptionBox
