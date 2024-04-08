import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [inputAmount, setInputAmount] = useState("");

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
    
    const result = await axios.post("/payment/orders", { inputAmount } );

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_SC54rSSO88X9vT", // Enter the Key ID generated from the Dashboard
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
    <div className="App">
      <header className="App-header">
        <input className="App-link" type="text" placeholder="Enter amount" onChange={(e) => setInputAmount(e.target.value)}/>
        <br />
        <button className="App-link" onClick={displayRazorpay}>
          Pay Now
        </button>
      </header>
    </div>
  );
}

export default App;
