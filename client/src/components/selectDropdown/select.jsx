import React, { useState } from "react";
import '../../components/selectDropdown/select.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { ClickAwayListener } from "@mui/base";


const Select = ({data, placeholder, icon}) => {
    const [isOpenSelect, setIsOpenSelect] = useState(false);
    const [selectIndex, setSelectIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState("All Categories")

    const openSelect = () => {
        setIsOpenSelect(!isOpenSelect);
    }

    const closeSelect = (index, categoryName) => {
        setSelectIndex(index);
        setSelectedItem(categoryName);
        openSelect();
    }

    return (
        // <ClickAwayListener onClickAway={(setIsOpenSelect(false))}>
            <div className="selectDropdownWrapper cursor position-relative">
                {icon}
                <span className="openSelect" onClick={openSelect}> {placeholder} <KeyboardArrowDownIcon className="arrow" /></span>
                {
                    isOpenSelect === true &&
                    <div className="selectDrop"> 
                        <div className="searchField">
                            <input type="text" placeholder="Search here.." />
                        </div>
                        <ul className="searchResults"> 
                            <li key={0} onClick={()=>closeSelect(0, placeholder)} className={`${selectIndex === 1 ? 'active' : ''}`}>{placeholder}</li>

                            { 
                                data.map((item, index) =>{
                                    return(
                                        <li key={index+1} onClick={()=>closeSelect(index, item)} className={`${selectIndex === 1 ? 'active' : ''}`}>{item}</li>

                                    )
                                }) 
                            }
                        </ul>
                    </div>
                }
                
            </div>
        // </ClickAwayListener>

    )
}

export default Select;