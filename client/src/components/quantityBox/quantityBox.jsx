import React, {useState, useEffect, useContext} from "react";
import "./quantityBox.css";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { MyContext } from "../../App";


const QuantityBox = (props) => {
    const [inputValue, setInputValue] = useState(1);
    const [cartItems, setCartItems] = useState([]);

    const context = useContext(MyContext)

    useEffect(() => {
        if (props?.value !== undefined && props?.value !== null && props?.value !== "") {
            setInputValue(parseInt(props?.value));
        }
    }, [props.value]);  



    const plus = () =>{
        let inStock = parseInt(props.item.countInStock);

        if (inputValue < inStock) {
            setInputValue(inputValue + 1)
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Quantity is more then the product in stock!"
            });
        }
    }

    const minus = () =>{
        if (inputValue !== 1 && inputValue > 0) {
            setInputValue((inputValue - 1));
        }
    }

    useEffect(() => {
        if (props.quantity){
            props.quantity(inputValue)
        }

        if (props.selectedItem){
            props.selectedItem(props.item, inputValue)
        }


        let countInStock = parseInt(props.item.countInStock);

        if (inputValue > countInStock) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Quantity is more then the product in stock!"
            })
        }else {
            context.setAlertBox({
                open: false,
                error: false,
                msg: "Quantity is more then the product in stock!"
            })
        }
    }, [inputValue]); 

    return (
        <div className="addCartSection d-flex align-items-center">
            <div className="counterSection mr-3">
                <span>Quantity:</span>
                <input type="text" value={inputValue} />
                <span className="arrow add" onClick={plus}><KeyboardArrowUpOutlinedIcon /></span>
                <span className="arrow minus" onClick={minus}><KeyboardArrowDownOutlinedIcon /></span>
            </div>
        </div>
    )
}

export default QuantityBox;