// import React, {useEffect, useState} from "react";
// import {Link} from "react-router-dom";
import "./category.css";
// import food from "../../assets/images/food.jpg";



// const Category = (props)=> {
//     const [navData, setNavData] = useState([]);

    
//     useEffect(()=>{
//         setNavData(props.data)
//     }, [])

//     return(
//         <div className="category card">
//             <h5 className="mb-4 heading">{props.catData.name}</h5>
//             <div className="categoryItems">
//                 { 
//                     props.catData?.children?.map((childCat, index) => {

//                         return (

//                                 <div className="catItem" key={index}>
//                                     <Link to={`/product/subCat/${childCat?._id}`} >
//                                         <img src={childCat?.images[0]}/>
//                                         <p>{childCat.name}</p>
//                                     </Link>
//                                 </div>
//                         );
//                     })
//                 }

//                 <div className="categoryLink">
//                     <a href="">See more..</a>
//                 </div>
//             </div>
         
//         </div>
//     )
// }

// export default Category;


import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ catData }) => {
    return (
        <div className="category-card">
            <h5 className="category-heading">{catData?.name}</h5>
            <div className="category-grid">
                {catData?.children?.slice(0, 4).map((childCat, index) => (
                    <div className="category-grid-item" key={index}>
                        <Link to={`/product/subCat/${childCat?._id}`} className="category-link">
                            <img src={childCat?.images[0]} alt={childCat.name} className="category-img" />
                            <p className="category-caption">{childCat.name}</p>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="category-more">
                <Link to={`/category/${catData?._id}`} className="see-more-link">
                    See more..
                </Link>
            </div>
        </div>
    );
};

export default CategoryCard;
