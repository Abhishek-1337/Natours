import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51NJrQsSDvRsVQZ54SCxSEkkmc21tye7hdWtIsE9XxAgZjGKILAjwp5P3kkaATWKi4kR6GfTtzYghVYb7PUxTEhPt00RsGM9p9j');


export const bookTour = async (tourId) => {
    try{
        //Get checkout session from API
        const session = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`)
        
        //Create checkout form and charge credit card using stripe object
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    }
    catch(err){
        console.log(err);
        showAlert('error', err);
    }
}