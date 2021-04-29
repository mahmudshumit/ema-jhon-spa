import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import SimpleForm from './SimpleForm';
import SplitCardForm from './SplitCardForm';


const stripePromise = loadStripe('pk_test_51Ie1aQA3htQk726T0Gx2K9jEhnoLGxQqlPg8ZSvCCZ2rECK77JZ1kKte2qHCGxiITHwJ7RzUzg8Se2E9vLn7ZB3d00INh3aHrN');

const ProcessPayment = ({handlePayment}) => {
    return (
        <Elements stripe={stripePromise}>
          <SimpleForm handlePayment={handlePayment}></SimpleForm>
          {/* <SplitCardForm></SplitCardForm> */}
        </Elements>
    );
};

export default ProcessPayment;