import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    setInputAmount(event.target.value);

    if (!inputAmount || inputAmount === "") {
      setError("");
    }
    if (inputAmount > 5000) {
      setError("No Amount can be greater than 5000");
    } else if (inputAmount < 100) {
      setError("No Amount can be less than 100");
    }
  }

  console.log(inputAmount);
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

    const result = await axios.post("/payment/orders", { inputAmount });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_zyDAc5RTXVOynq", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
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

        const result = await axios.post("/payment/success", data);

        alert(result.data.msg);
      },
      prefill: {
        name: "Shivani Sahu",
        email: "test@exmaple.com",
        contact: "+91 8788787768",
      },
      notes: {
        address: "E-commerce Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      <div className="container">
        <div className="outerPart">
          <div className="upper-header">
            <h2>Topup</h2>
          </div>
          <div className="user-details">
            <div className="accDetails">
              <span>Account Number</span>
              <span>4675&nbsp;3389&nbsp;7089</span>
            </div>
            <div className="accDetails">
              <span>Amount</span>
              <span>400</span>
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
          </div>

          {error && <span className="error">{error}</span>}

          <br />
          <button className="App-Button" onClick={displayRazorpay}>
            Proceed to payment
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
