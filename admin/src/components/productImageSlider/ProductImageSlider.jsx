import React, { useState } from "react";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import Modal from "react-modal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductImageSlider = ({ images }) => {
  const [navSlider, setNavSlider] = useState(null);
  const [mainSlider, setMainSlider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const mainSliderSettings = {
    asNavFor: navSlider,
    ref: (slider) => setMainSlider(slider),
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const navSliderSettings = {
    asNavFor: mainSlider,
    ref: (slider) => setNavSlider(slider),
    slidesToShow: images.length > 4 ? 4 : images.length, // Show max 4 thumbnails
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true,
    infinite: true,
    arrows: true,
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Main Image Slider with Zoom */}
      <Slider {...mainSliderSettings} className="border rounded-lg overflow-hidden">
        {images.map((img, index) => (
          <div key={index} className="h-[400px] flex items-center justify-center cursor-pointer">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: `Product ${index}`,
                  isFluidWidth: true,
                  src: img,
                },
                largeImage: {
                  src: img,
                  width: 1200,
                  height: 800,
                },
                enlargedImageContainerStyle: { zIndex: 100 },
              }}
            />
            <div
              className="absolute inset-0"
              onClick={() => openModal(img)} // Open modal on click
            />
          </div>
        ))}
      </Slider>

      {/* Thumbnail Slider */}
      <Slider {...navSliderSettings} className="mt-4">
        {images.map((img, index) => (
          <div key={index} className="px-2">
            <img
              src={img}
              alt={`Thumbnail ${index}`}
              className="h-[80px] w-full object-cover border rounded-lg cursor-pointer"
              onClick={() => openModal(img)}
            />
          </div>
        ))}
      </Slider>

      {/* Fullscreen Lightbox Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="flex items-center justify-center">
        <div className="relative">
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={closeModal}>
            ✖
          </button>
          <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-screen object-contain" />
        </div>
      </Modal>
    </div>
  );
};

export default ProductImageSlider;
