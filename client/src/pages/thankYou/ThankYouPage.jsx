import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "./thankYouPage.css"; // Import styles
import { fetchDataFromApi } from "../../utils/apiCalls";

const ThankYouPage = () => {
    const [orderData, setOrderData] = useState()
    const navigate = useNavigate();

    useEffect(()=>{

        //fetch user address
        fetchDataFromApi(`/api/order/number`).then((res) => {
            setOrderData(res)
        });
    })
    // Mock order details (Replace with actual data)
    const orderNumber = "ORD123456";
    const totalPrice = "$120.00";

    return (
        <div className="thank-you-container">
            <div className="thank-you-card">
                <FaCheckCircle className="thank-you-icon" />
                <h1>Thank You for Your Purchase!</h1>
                <p>We will confirm shortly and get back to you.</p>

                <div className="order-details">
                    <p><strong>Order Number:</strong> {orderData?.orderNumber}</p>
                    <p><strong>Total Amount:</strong> ${orderData?.totalPrice}.00</p>
                </div>

                <button className="continue-shopping" onClick={() => navigate("/")}>
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default ThankYouPage;
