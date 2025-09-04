import { useParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import './ProductDetails.css';
import axios from 'axios';

// UI only: sample product lookup; replace with API fetch later.
const sampleProducts = [
  {
    _id: '68b01176b35c96a2870fa0fa',
    title: 'test_product',
    description: 'test_description',
    price: { amount: 999, currency: 'INR' },
    images: [
      'https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/faac7bd7-de98-41c6-81ee-1662f17e7ac5_p8DgQjfuxw',
      'https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/e22e71f1-7299-497a-8d4d-6d79c6372bb2_EVDvZvd55C',
      'https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/fbcc73d9-818f-4f6e-8734-c73440c17020_4O98LOZ8fy'
    ],
    stock: 20
  },

];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`)
        // console.log(response.)
        setProduct(response.data.product)

      } catch (error) {
        throw new Error(error)
      }
    }

    fetchData()

  }, [id])


  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) {
    return <div className="pd-shell"><p>Product not found.</p></div>;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create order on backend
      axios.post(`http://localhost:3000/api/payment/create/${id}`, {}, { withCredentials: true })
        .then(function (response) {
          var options = {
            "key": "rzp_test_RDUIFOnWFSrDTF", // Enter the Key ID generated from the Dashboard
            "amount": response.data.amount, // Amount in currency subunits. Default currency is INR.
            "currency": response.data.currency,
            "name": "Shree Shopy",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": response.data.payment.orderId,
            "handler": function (response) {
              axios.post('http://localhost:3000/api/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              }, { withCredentials: true })
                .then(function (response) {
                  alert('Payment verified successfully');
                })
                .catch(function (error) {
                  console.error(error);
                });
            },
            "prefill": {
              "name": "Gaurav Kumar",
              "email": "gaurav.kumar@example.com",
              "contact": "9000090000"
            },
            "notes": {
              "address": "Razorpay Corporate Office"
            },
            "theme": {
              "color": "#3399cc"
            }
          };
          var rzp1 = new Razorpay(options);
          rzp1.on('payment.failed', function (response) {
            alert('Payment Failed');
            alert('Error Code: ' + response.error.code);
            alert('Description: ' + response.error.description);
            alert('Source: ' + response.error.source);
            alert('Step: ' + response.error.step);
            alert('Reason: ' + response.error.reason);
            alert('Order ID: ' + response.error.metadata.order_id);
            alert('Payment ID: ' + response.error.metadata.payment_id);
          });
          rzp1.open();

        })
    } catch (err) {
      console.error(err);
    }
  };


  const activeImage = product.images?.[activeIndex];
  const out = product.stock <= 0;

  return (
    <div className="pd-shell" aria-labelledby="pd-title">
      <div className="pd-media" aria-label="Product images">
        {activeImage ? (
          <img src={activeImage} alt={product.title} className="pd-main-img" />
        ) : (
          <div className="pd-main-img" aria-hidden="true" />
        )}
        {product.images && product.images.length > 1 && (
          <div className="pd-thumbs" role="list">
            {product.images.map((img, i) => (
              <button key={img} type="button" className={`pd-thumb ${i === activeIndex ? 'active' : ''}`} role="listitem" onClick={() => setActiveIndex(i)} aria-label={`Show image ${i + 1}`}>
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="pd-info">
        <h1 id="pd-title" className="pd-title">{product.title}</h1>
        <div className={`pd-stock ${out ? 'out' : ''}`}>{out ? 'Out of stock' : `${product.stock} in stock`}</div>
        <div className="pd-price" aria-live="polite">{product.price.amount}</div>
        <p className="pd-desc">{product.description}</p>
        <div className="pd-actions">
          <button onClick={handlePayment} className="btn-buy" disabled={out}>{out ? 'Unavailable' : 'Buy now'}</button>
        </div>
        <div className="pd-meta">
          <span><strong>ID:</strong> {product._id}</span>
          <span><strong>Currency:</strong> {product.price.currency}</span>
        </div>
      </div>
    </div>
  );
}
