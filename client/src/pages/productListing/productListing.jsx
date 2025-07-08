import React, { useContext, useState, useEffect} from "react";
import "./productListing.css";
// import{ Link, useParams } from "react-router-dom";
// import Sidebar from "../../components/sidebar/sidebar";
// import { CircularProgress } from "@mui/material";

import { Link, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/apiCalls";
import ProductListingCard from "../../components/productListingCard/ProductListingCard";


// const ProductListing = () =>{
    // const [isLoading, setIsLoading] = useState(false);
    // const [filterId, setFilterId] = useState("");
    // const [productData, setProductData] = useState([]);
    // const [currentCategory, setCurrentCategory] = useState("");

    // const {id} = useParams();
    // const context = useContext(MyContext);

    // const [sidebarOpen, setSidebarOpen] = useState(false);

    // const toggleSidebar = () => {
    // setSidebarOpen(!sidebarOpen);
    // };

    // useEffect(() => {
    //     window.scrollTo(0,0);
    //     setFilterId("");

    //     let url =  window.location.href;
    //     let apiEndPoint = "";


    //     if (url.includes('subCat')) {
    //         apiEndPoint = `/api/product?subCatId=${id}`;
    //     }

    //     if (url.includes('category')) { 
    //         apiEndPoint = `/api/product?category=${id}`;
    //     }

    //     setIsLoading(true); 
    //     fetchDataFromApi(`${apiEndPoint}`).then((res) =>{
    //         setProductData(res)
    //         setIsLoading(false);
    //     })

    //     fetchDataFromApi(`/api/category/${id}`).then((res) =>{
    //         setCurrentCategory(res)
    //     })
    // }, [id])


    // const filterByRating = (rating) => {

    //     setIsLoading(true);
    //     let apiEndPoint = `/api/product?rating=${rating}&category=${id}`;

    //     fetchDataFromApi(`${apiEndPoint}`).then((res) =>{
    //         setProductData(res)
    //         window.scrollTo({
    //             top: 0,
    //             bahavior: 'smooth'
    //         });
    //         setIsLoading(false);
    //     })
    // }
    
    // const filterByPrice = (price, catId) => {
    //     let url =  window.location.href;
    //     let apiEndPoint = "";


    //     if (url.includes('subCat')) {
    //         // apiEndPoint = `/api/product?subCatId=${id}`;
    //         apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${catId}`;

    //     }

    //     if (url.includes('category')) { 
    //         // apiEndPoint = `/api/product?category=${id}`;
    //         apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${catId}`;

    //     }

    //     setIsLoading(true);
    //     // let apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${catId}`;
    //     // apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${catId}`;


    //     fetchDataFromApi(`${apiEndPoint}`).then((res) =>{
    //         setProductData(res)
    //         // window.scrollTo({
    //         //     top: 0,
    //         //     bahavior: 'smooth'
    //         // });
    //         setIsLoading(false);
    //     })
    // }

    // const handleFilterChange = (filter) => {
    //     if (filter === "featured") {
    //         window.scrollTo(0,0);
    //         setProductData(context?.featured);

    //     }

    //     if (filter === "popular") { 
    //         window.scrollTo(0,0);
    //         setProductData(context?.mostPopular);
    //     }

    //     if (filter === "topSelling") {
    //         window.scrollTo(0,0);
    //         setProductData(context?.topSelling);
    //     }

    //     if (filter === "recommended") {
    //         window.scrollTo(0,0);
    //         setProductData(context?.recommendedProducts);
    //     }

    //     if (filter === "newlyAdded") {
    //         window.scrollTo(0,0);
    //         setProductData(context?.newArrivals);
    //     }

    // }

//     return(
// <>
//   {/* Enhanced Breadcrumb */}
//   <div className="breadcrumb-wrapper">
//     <nav aria-label="breadcrumb">
//       <ol className="breadcrumb">
//         <li className="breadcrumb-item">
//           <Link to="/">Home</Link>
//         </li>
//         <li className="breadcrumb-item">
//           <Link to="#">Category</Link>
//         </li>
//         <li className="breadcrumb-item active" aria-current="page">
//           {currentCategory?.name}
//         </li>
//       </ol>
//     </nav>
//   </div>

//   {/* Main Listing Section */}
//   <section className="product-listing">
//     <div className="container-fluid">
//       <div className="listing-content">
//         <div className="row">
//           {/* Sidebar - Collapsible on mobile */}
//           <div className="col-lg-3 col-md-4 sidebar-container">
//             <div className="sidebar-toggle d-md-none" onClick={toggleSidebar}>
//               {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
//               <span className="toggle-icon">{sidebarOpen ? '−' : '+'}</span>
//             </div>
//             <div className={`sidebar-content ${sidebarOpen ? 'open' : ''}`}>
//               <Sidebar 
//                 filterByRating={filterByRating} 
//                 filterByPrice={filterByPrice} 
//                 catId={id} 
//                 onChangeFilter={handleFilterChange} 
//               />
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className="col-lg-9 col-md-8 product-content">
//             <div className="listing-header">
//               <h1 className="listing-title">{currentCategory?.name}</h1>
//               <p className="results-count">
//                 We found <span className="highlight">{productData?.products?.length || 0}</span> items for you!
//               </p>
//             </div>
            
//             {/* Product Grid */}
//             <div className="product-grid-container">
//               {isLoading ? (
//                 <div className="loading-state">
//                   <CircularProgress className="spinner" />
//                   <p>Loading products...</p>
//                 </div>
//               ) : (
                // <div className="product-grid">
                //   {productData?.products?.length > 0 ? (
                //     productData.products.map((product, index) => (
                //       <div className="product-card-wrapper" key={index}>
                //         <ProductListingCard productData={product} />
                //       </div>
                //     ))
                //   ) : (
                //     <div className="no-results">
                //       <img src="/images/no-products.svg" alt="No products found" />
                //       <h3>No products found</h3>
                //       <p>Try adjusting your filters or search criteria</p>
                //     </div>
                //   )}
                // </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// </>

//     )
// }

// export default ProductListing;

const ProductListingPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: null,
    sortBy: 'featured'
  });
    //   const [isLoading, setIsLoading] = useState(false);
    // const [filterId, setFilterId] = useState("");
    const [productData, setProductData] = useState([]);
    // const [currentCategory, setCurrentCategory] = useState("");

    const {id} = useParams();
    const context = useContext(MyContext);



    useEffect(() => {
        window.scrollTo(0,0);
        // setFilterId("");

        let url =  window.location.href;
        let apiEndPoint = "";

        if (url.includes('subCat')) {
            apiEndPoint = `/api/product?subCatId=${id}`;
        }

        if (url.includes('category')) { 
            apiEndPoint = `/api/product?category=${id}`;
        }

        setIsLoading(true); 
        fetchDataFromApi(`${apiEndPoint}`).then((res) =>{
            console.log(res);
            setProductData(res)
            setIsLoading(false);
        })

        fetchDataFromApi(`/api/category/${id}`).then((res) =>{
            setCurrentCategory(res)
        })
    }, [id])
  

  // Mock data fetch - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls
        const categoryResponse = { _id: categoryId, name: "Electronics" };
        const productsResponse = Array(12).fill().map((_, i) => ({
          _id: i.toString(),
          name: `Product ${i + 1}`,
          price: Math.floor(Math.random() * 500) + 50,
          rating: Math.floor(Math.random() * 5) + 1,
          imageUrl: `https://via.placeholder.com/300?text=Product+${i+1}`,
          category: categoryId
        }));
        
        setCurrentCategory(categoryResponse);
        setProducts(productsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    // Here you would typically refetch products with new filters
  };

  return (
    <div className="product-listing-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/categories">Categories</Link>
              </li>
              <li className="breadcrumb-item active">
                {currentCategory?.name || 'Loading...'}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="listing-container">
        <div className="container">
          <div className="listing-grid">
            {/* Filters Sidebar */}
            <aside className={`filters-sidebar ${sidebarOpen ? 'open' : ''}`}>
              <div className="sidebar-header">
                <h3>Filters</h3>
                <button className="close-sidebar" onClick={toggleSidebar}>
                  &times;
                </button>
              </div>
              
              <div className="filter-section">
                <h4>Sort By</h4>
                <select 
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range">
                  <span>${filters.priceRange[0]}</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange({ priceRange: [filters.priceRange[0], e.target.value] })}
                  />
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>

              <div className="filter-section">
                <h4>Customer Rating</h4>
                {/* {[4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="rating-option">
                    <input
                      type="radio"
                      id={`rating-${stars}`}
                      name="rating"
                      checked={filters.rating === stars}
                      onChange={() => handleFilterChange({ rating: stars })}
                    />
                    <label htmlFor={`rating-${stars}`}>
                      {[...Array(stars)].map((_, i) => (
                        <span key={i} className="star">★</span>
                      ))}
                      {stars < 5 && (
                        [...Array(5 - stars)].map((_, i) => (
                          <span key={i} className="star">☆</span>
                        ))
                      }
                      {stars === 4 && ' & Up'}
                    </label>
                  </div>
                ))} */}
              </div>
            </aside>

            {/* Product Listing */}
            <div className="product-listing">
              <div className="listing-header">
                <h1>{currentCategory?.name || 'Products'}</h1>
                <button className="mobile-filter-btn" onClick={toggleSidebar}>
                  <i className="filter-icon">⚙️</i> Filters
                </button>
                <p className="results-count">
                  Showing <span>{products.length}</span> products
                </p>
              </div>

              {isLoading ? (
                <div className="loading-state">
                  <CircularProgress size={60} />
                  <p>Loading products...</p>
                </div>
              ) : productData?.products?.length > 0 ? (
                <div className="product-grid">
                    {
                        productData.products.map((product, index) => (
                        <div className="product-card-wrapper" key={index}>
                            <ProductListingCard productData={product} />
                        </div>
                        ))
                    }
                </div>
              ) : (
                     <div className="no-results">
                            <img src="/images/no-products.svg" alt="No products found" />
                            <h3>No Products Found</h3>
                            <p>Try adjusting your filters or search criteria</p>
                            <button 
                                className="reset-filters-btn"
                                onClick={() => setFilters({
                                priceRange: [0, 1000],
                                rating: null,
                                sortBy: 'featured'
                                })}
                            >
                                Reset All Filters
                            </button>
                        </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductListingPage;