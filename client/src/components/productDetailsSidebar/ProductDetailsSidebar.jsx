import React, { useState } from "react";
import { Button } from "@mui/material";
import { 
    LocalShippingOutlined, 
    PaymentsOutlined, 
    CreditScoreOutlined, 
    ExpandMore, 
    ExpandLess 
} from "@mui/icons-material";
import "./productDetailsSidebar.css"; // Ensure CSS file exists

const ProductDetailsSidebar = () => {
    const [modalShow, setModalShow] = useState(false);
    const [expanded, setExpanded] = useState({});

    // Toggle dropdown items
    const toggleExpand = (index) => {
        setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const sidebarItems = [
        {
            icon: <LocalShippingOutlined />,
            title: "Free Delivery",
            description: "For orders over $150",
            button: { text: "Request Delivery", action: () => setModalShow(true) }
        },
        {
            icon: <PaymentsOutlined />,
            title: "Money Back Guarantee",
            description: "15 days refund guarantee"
        },
        {
            icon: <CreditScoreOutlined />,
            title: "Secure Payment",
            description: "Safe & secure transactions"
        }
    ];

    return (
        <div className="sidebar">
            {sidebarItems.map((item, index) => (
                <div key={index} className="sidebar-section">
                    <div className="sidebar-item" onClick={() => toggleExpand(index)}>
                        <div className="icon">{item.icon}</div>
                        <div className="text">
                            <h5>{item.title}</h5>
                            {expanded[index] ? <ExpandLess /> : <ExpandMore />}
                        </div>
                    </div>
                    {expanded[index] && (
                        <div className="sidebar-content">
                            <p>{item.description}</p>
                            {item.button && (
                                <Button 
                                    className="sidebar-btn" 
                                    onClick={item.button.action}
                                >
                                    {item.button.text}
                                </Button>
                            )}
                        </div>
                    )}
                    <hr />
                </div>
            ))}

            {/* Delivery Request Modal (Replace with actual modal component) */}
            {modalShow && (
                <div className="modal-overlay" onClick={() => setModalShow(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h4>Request Delivery</h4>
                        <p>Enter details for delivery request.</p>
                        <Button onClick={() => setModalShow(false)}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsSidebar;
