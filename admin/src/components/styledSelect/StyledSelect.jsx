import { useState } from "react";
import "./styledSelect.css";

const StyledSelect = ({onSelectChange, orderId, selectData}) => {
    const [data, setData] = useState("");
 
    const handleSelectChange  = (e) => {
        setData(e.target.value);
        onSelectChange(e.target.value, orderId);
    }

    return (
        <div className="pickup-container">
            {/* <label htmlFor="pickup" className="pickup-label">
                Select a Pickup Station:
            </label> */}
          
            <select
                id="pickup"
                value={data}
                onChange={handleSelectChange}
                className="selectElem"
            >
                <option value="" disabled>
                    Change Status
                </option>
              
                {selectData.map((item, index) => (
                    <option key={index}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StyledSelect;
