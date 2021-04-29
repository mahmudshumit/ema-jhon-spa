import React, { useEffect, useState } from 'react';

import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link } from 'react-router-dom';

const Shop = () => {
    // const first10 = fakeData.slice(0, 10);


    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search,setSearch] = useState([]);

    useEffect(() => {
           fetch('https://thawing-castle-41115.herokuapp.com/products?search='+search)
           .then(res=>res.json())
           .then(data =>setProducts(data))

    },[search])


    useEffect(() => {
        const saveCart = getDatabaseCart();
        
        const productKeys = Object.keys(saveCart);


        fetch('https://thawing-castle-41115.herokuapp.com/productsByKeys',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(productKeys)
        })
        .then(res=>res.json())
        .then(data=>setCart(data))
    }, [])
    const handleSearch = event =>{
     setSearch(event.target.value);
    }

    const handleAddProduct = (product) => {
        const toBeAdded = product.key;

        const sameProduct = cart.find(product => product.key === product.key);
        let count = 1;
        let newCart;
        if (sameProduct) {
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(product => product.key !== toBeAdded);
            newCart = [...others, sameProduct];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }

        setCart(newCart);

        addToDatabaseCart(product.key, count);

    }
    return (
        <div className="twin-container">
            <div className="product-container">
              <input type="text" onBlur={handleSearch} className="product"/>

                {
                    products.map(product =>
                        <Product
                            key={product.key}
                            showAddToCart={true}
                            handleAddProduct={handleAddProduct}
                            product={product}>

                        </Product>)
                }

            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <Link to="/review">
                        <button className='main-button'>Review Order</button>
                    </Link>
                </Cart>
            </div>



        </div>
    );
};

export default Shop;