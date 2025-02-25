import { useState } from "react";
import "./styledSelect.css";

const StyledSelect = ({onSelectChange, selectData}) => {
    const [data, setData] = useState("");
 
    const handleSelectChange  = (e) => {
        setData(e.target.value);
        onSelectChange(e.target.value);
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
                    Choose a station...
                </option>
                {selectData.map((station, index) => (
                    <option key={index} value={station}>
                        {station}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StyledSelect;
