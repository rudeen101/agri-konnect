import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./quantitySelector.css"; // Import CSS for styling

const QuantitySelector = ({ stock, productId, initialQuantity, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const increaseQuantity = () => {
        if (quantity < stock) {
            setQuantity(quantity + 1);
            onQuantityChange(quantity + 1, productId);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            onQuantityChange(quantity - 1, productId);
        }
    };

    const handleInputChange = (e) => {
        let value = parseInt(e.target.value);
        if (!value || value < 1) value = 1;
        if (value > stock) value = stock;
        setQuantity(value);
        onQuantityChange(value, productId);
    };

    return (
        <div className="quantity-selector">
            <button className="btn-minus" onClick={decreaseQuantity} disabled={quantity === 1}>
                <FaMinus />
            </button>
            <input type="number" value={quantity} onChange={handleInputChange} />
            <span className="text">item(s) selected</span>
            <button className="btn-plus" onClick={increaseQuantity} disabled={quantity >= stock}>
                <FaPlus />
            </button>
        </div>
    );
};

export default QuantitySelector;
