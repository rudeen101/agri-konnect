import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "./category.css";
import food from "../../assets/images/food.jpg";



const Category = (props)=> {
    const [navData, setNavData] = useState([]);

    
    useEffect(()=>{
        setNavData(props.data)
    }, [])

    return(
        <div className="category">
            <h5 className="mb-4 heading">{props.catData.name}</h5>
            <div className="categoryItems">
                { 
                    props.catData?.children?.map((childCat, index) => {

                        return (
                            <div className="catItem">
                            <img src={childCat?.images[0]}/>
                            <p>{childCat.name}</p>
                        </div>
                        );
                    })
                }
            </div>
            <div className="categoryLink">
                <a href="">See more..</a>
            </div>
        </div>
    )
}

export default Category;