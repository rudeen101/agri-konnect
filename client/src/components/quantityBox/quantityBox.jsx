import React, {useState} from "react";
import "./quantityBox.css";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';


const QuantityBox = (props) => {
    const [inputValue, setInputValue] = useState(props.value);

    const plus = () =>{
        setInputValue(inputValue + 1)
    }

    const minus = () =>{
        setInputValue(inputValue - 1)
    }
    return (
        <div className="addCartSection d-flex align-items-center">
            <div className="counterSection mr-3">
                <span>Quantity:</span>
                <input type="number" value={inputValue} />
                <span className="arrow add" onClick={plus}><KeyboardArrowUpOutlinedIcon /></span>
                <span className="arrow minus" onClick={minus}><KeyboardArrowDownOutlinedIcon /></span>
            </div>
        </div>
    )
}

export default QuantityBox;