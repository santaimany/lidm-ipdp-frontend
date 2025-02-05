import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import page1 from "../Book/pages1.svg";
import page6 from "../Book/pages6.svg";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

const images = [
  { src: page1, path: "/Book1" },  
  { src: page6, path: "/page6" }
];

const Gallery = () => {
  const navigate = useNavigate();  

  const handleCardClick = (path) => {
    navigate(path);  
  };

  return (
    <div className="w-full h-screen  flex justify-center items-center">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 0,
          stretch: 20,
          depth: 200,
          modifier: 2,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full max-w-[1500px]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="swiper-slide-custom">
            <img
              src={image.src}
              alt={`Slide ${index}`}
              className="rounded-lg cursor-pointer "
              onClick={() => handleCardClick(image.path)}  
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Gallery;
