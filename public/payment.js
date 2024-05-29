// Initialize Stripe
const stripe = Stripe('pk_test_51PL1e3Rtbof8O2Y8zVx8hmIB5qDVwcrclnOjkY3KYzYJyKupxWUAh6nAbE6MyeFI21dhPK2ndjQoLIsL1pHhgeEi00Hom4i1ZJ'); // Utilisez votre clé publique de test Stripe

// Set up Stripe.js and Elements to use in checkout form
const elements = stripe.elements();
const cardElement = elements.create('card');

// Add an instance of the card Element into the `card-element` <div>
cardElement.mount('#card-element');

// Handle real-time validation errors from the card Element
cardElement.on('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log('Form submitted');

  try {
    const response = await fetch('http://localhost:3000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000, // Le montant en centimes
        currency: 'usd'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const {clientSecret} = await response.json();
    console.log('Client secret received:', clientSecret);

    const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'John Doe' // Ajoutez d'autres informations de facturation si nécessaire
        }
      }
    });

    if (error) {
      // Show error to your customer (e.g., insufficient funds)
      console.error('Payment error:', error.message);
      alert(`Payment error: ${error.message}`);
    } else {
      // The payment has been processed!
      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded!');
        alert('Payment succeeded!');
        // Afficher les détails du paiement
        const paymentDetails = document.getElementById('payment-details');
        let receiptUrl = 'No receipt available';
        if (paymentIntent.charges && paymentIntent.charges.data.length > 0) {
          receiptUrl = paymentIntent.charges.data[0].receipt_url;
        }
        paymentDetails.innerHTML = `
          <p>Payment succeeded!</p>
          <p>Payment ID: ${paymentIntent.id}</p>
          <p>Amount: ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}</p>
          <p>Receipt: <a href="${receiptUrl}" target="_blank">View Receipt</a></p>
        `;
      }
    }
  } catch (err) {
    console.error('Error:', err);
    alert(`Error: ${err.message}`);
  }
});
