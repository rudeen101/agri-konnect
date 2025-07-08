
import "./category.css";


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
