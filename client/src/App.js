import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import HeaderLogo from "./logo.png";
import PaymentSuccess from './tick-right.jpg';
import "./App.css";
import axios from "axios";

function App() {
  const [initialMoney, setMoney] = useState(4000);
  const [inputAmount, setInputAmount] = useState(0);
  const [error, setError] = useState("");
  const [setPayment, setSetPayment] = useState(false);

  useEffect(() => {
    if (!inputAmount) {
      setError("");
    } else if (inputAmount > 5000) {
      setError("Amount can't be greater than 5000");
    } else if (inputAmount < 1) {
      setError("Amount can't be less than 1");
    } else {
      setError("");
    }
  }, [inputAmount, initialMoney]);

  const handleChange = (event) => {
    setInputAmount(event.target.value);
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.get("/payment/orders", { inputAmount });


    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    console.log("this is result", result);
    
    const { amount, id: order_id, currency } = result;

    const options = {
      key: "rzp_test_zyDAc5RTXVOynq", // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: currency,
      name: "E-commerce Corp.",
      description: "Test Transaction",
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.get("/payment/success", data);

        if (result.data.msg === "success") {
          setSetPayment(true);
          setMoney(initialMoney - inputAmount);
        }
      },
      prefill: {
        name: "Shivani Sahu",
        email: "shivani@test.com",
        contact: "+91 8788787768",
      },
      notes: {
        address: "E-commerce Corporate Office",
      },
      theme: {
        color: "#4435b1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  return (
    <>
      <div className="container">
        <div className="outerPart">
          {setPayment ? (
            <div className="payment-done">
              <img src={PaymentSuccess} width={100} height={100} alt="logo" />
              <h3>Payment Done</h3>
              <p>Your payment has been successfully processed.</p>
            </div>
          ) : (
            <>
              <div className="upper-header">
                <img
                  src={HeaderLogo}
                  width="100%"
                  height="100%"
                  alt="logo"
                  className="logo"
                />
              </div>
              <div className="to">
                <span>To</span>
                <div className="sender-part">
                  <div className="sender-details">
                    <img
                      src={logo}
                      width="40px"
                      height="40px"
                      alt="logo"
                      className="senderLogo"
                    />
                    <p className="senderName">E-Commerce Corp</p>
                  </div>
                </div>
              </div>
              <div className="order-details">
                <p className="heading">Amount to Pay</p>
                <div className="amount">
                  <i className="rupees-sign">₹</i>
                  <input
                    className="paymentLink"
                    type="number"
                    max="5000"
                    min="100"
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
              {error && <span className="error">{error}</span>}
              </div>

              <div className="user-details">
                <div className="accDetails">
                  <span>Account Number</span>
                  <span>4675&nbsp;3389&nbsp;7089</span>
                </div>
                <div className="accDetails">
                  <span>Amount</span>
                  <span>{initialMoney}</span>
                </div>
              </div>

              <button
                className="App-Button"
                disabled={inputAmount > 5000 || inputAmount < 1 ? true : false}
                onClick={displayRazorpay}
              >
                Proceed to payment
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
