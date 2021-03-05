import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';
import fakeData from '../../fakeData';

const ProductDetail = () => {
    const {productkey} = useParams()

    const product =fakeData.find(product => product.key===productkey);
    console.log(product);
    return (
        <div>
            <h1>Your Product Details Here</h1>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;