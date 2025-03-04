import "./productInspiration.css";
import ProductListingCard from "../productListingCard/ProductListingCard";


const ProductInspirations = ({products}) => {

    return (
        <div className="container-fluid inspirations-section">
                <div  className="inspiration-card">
                    <br />
                    <h4 className="mt-5 ">Insprational Product Listing..</h4>
                    {/* <p>{inspiration.description}</p> */}
                    <div className="productListing">
                        {products?.map((product, index) => (
                            <ProductListingCard productData={product}></ProductListingCard>

                        ))}
                    </div>
                </div>
        </div>

        
    );
};

export default ProductInspirations;
