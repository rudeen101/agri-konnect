import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import './homeBannerSlider.css';

const HomeBannerSlider = ({sliderData}) => {
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



const BannerSettings = (slideCount) => ({
	dots: slideCount > 1, // Show dots only if more than one slide
	infinite: slideCount > 1, // Enable infinite only if multiple slides exist
	autoplay: true,
	autoplaySpeed: 5000,
	speed: 800,
	slidesToShow: slideCount > 0 ? 1 : 0, // Ensure at least 1 slide is shown
	slidesToScroll: 1,
	arrows: slideCount > 1, // Hide arrows if only 1 slide
  });

  return (
    <div className="home-banner-slider">
		<Slider {...BannerSettings(sliderData.length)}>
			{
				sliderData?.length > 0 &&
				sliderData?.map((banner, index)  => (
					<div key={index} className="banner-slide">
						<img
							src={banner.imageUrl}
							alt={banner.alt || `Banner ${index + 1}`}
							className="banner-image"
						/>
						<div className="banner-overlay">
							<h5 className="banner-title">{banner.title}</h5>
							<p className="banner-subtitle">{banner.subtitle}</p>
							{/* {banner?.ctaText && banner.ctaUrl && ( */}
							<button
								className="banner-cta"
								onClick={() => window.location.href = banner.ctaUrl}
							>
								{banner.ctaText}
							</button>
							{/* )} */}
						</div>
					</div>
				)
			)}
		</Slider>
    </div>
  );
};

export default HomeBannerSlider;
