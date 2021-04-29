import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';


const ProductDetail = () => {
    const {productKey} = useParams();
    const [product,setProduct] = useState({});

    useEffect(() => {

      fetch('https://thawing-castle-41115.herokuapp.com/products/'+productKey)
      .then(res=>res.json())
      .then(data =>setProduct(data))

    },[productKey])

    // const product =fakeData.find(product => product.key===productKey);
    
    return (
        <div>
            <h1>Your Product Details Here</h1>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;