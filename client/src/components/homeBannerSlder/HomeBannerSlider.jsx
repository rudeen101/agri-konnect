import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import './homeBannerSlider.css';

const HomeBannerSlider = ({data}) => {
//   const [banners, setBanners] = useState([]);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await axios.get('http://localhost:3000/api/banner');
//         setBanners(res.data.banners);
//       } catch (error) {
//         console.error('Error fetching banners:', error);
//       }
//     };
//     fetchBanners();
//   }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="home-banner-slider">
		{console.log("---",data	)}
		<Slider {...settings}>
			{
				 data?.data?.length > 0 &&
				 data?.data?.map((banner, index)  => (
				<div key={index} className="banner-slide">
					<img
						src={banner.images[0]}
						alt={banner.alt || `Banner ${index + 1}`}
						className="banner-image"
					/>
					<div className="banner-overlay">
						<h2 className="banner-title">Title</h2>
						<p className="banner-subtitle">subtitle</p>
						{/* {banner?.ctaText && banner.ctaUrl && ( */}
						<button
							className="banner-cta"
							onClick={() => window.location.href = banner.ctaUrl}
						>
							Action
						</button>
						{/* )} */}
					</div>
				</div>
			))}
		</Slider>
    </div>
  );
};

export default HomeBannerSlider;
