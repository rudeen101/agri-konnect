import "./productInspiration.css";
import ProductListingCard from "../productListingCard/ProductListingCard";


const ProductInspirations = ({products}) => {

    return (
	<div className="inspirations-section">
  <div className="inspiration-container">
    <div className="container-fluid inspiration-header">
      <h2 className="inspiration-title">Inspirational Product Listings</h2>
      <p className="inspiration-subtitle">Discover quality products from our farmers</p>
    </div>
    
    <div className="product-listing-grid">
      {products?.map((product, index) => (
        <ProductListingCard 
          key={index} 
          productData={product}
          className="product-card"
        />
      ))}
    </div>
  </div>
</div>

        
    );
};

export default ProductInspirations;
