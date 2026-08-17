import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Carousel.css";

import img1 from "../../assets/carousel/01.jpg";
import img2 from "../../assets/carousel/02.jpg";
import img3 from "../../assets/carousel/03.jpg";
import img4 from "../../assets/carousel/04.jpg";
import img5 from "../../assets/carousel/05.jpg";
import img6 from "../../assets/carousel/06.jpg";
import img7 from "../../assets/carousel/07.jpg";
import img8 from "../../assets/carousel/08.jpg";
import img9 from "../../assets/carousel/09.jpg";
import img10 from "../../assets/carousel/10.jpg";
import img11 from "../../assets/carousel/11.jpg";
import img12 from "../../assets/carousel/12.jpg";
import img13 from "../../assets/carousel/13.jpg";
import img14 from "../../assets/carousel/14.jpg";
import img15 from "../../assets/carousel/15.jpg";
import img16 from "../../assets/carousel/16.jpg";
import img17 from "../../assets/carousel/17.jpg";
import img18 from "../../assets/carousel/18.jpg";
import img19 from "../../assets/carousel/19.jpg";

const images = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19,
];

const SCROLL_SPEED = 0.5; // px per frame — tweak to taste

function Carousel() {
  const [selectedImg, setSelectedImg] = useState(null);
  const trackRef = useRef(null);
  const isPaused = useRef(false);
  const rafId = useRef(null);

  const openModal = (img) => setSelectedImg(img);
  const closeModal = () => setSelectedImg(null);

  const animate = useCallback(() => {
    const track = trackRef.current;
    if (track && !isPaused.current) {
      track.scrollLeft += SCROLL_SPEED;

      // half the scrollWidth = one full set of (non-duplicated) images
      const halfWidth = track.scrollWidth / 2;
      if (track.scrollLeft >= halfWidth) {
        track.scrollLeft -= halfWidth;
      }
    }
    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  useEffect(() => {
    isPaused.current = Boolean(selectedImg);
  }, [selectedImg]);

  return (
    <>
      <div className="past">Past Activities Pictures</div>

      <section className="carousel-section">
        <div
          className="carousel-track"
          ref={trackRef}
          onMouseEnter={() => (isPaused.current = true)}
          onMouseLeave={() => {
            if (!selectedImg) isPaused.current = false;
          }}
        >
          {[...images, ...images].map((img, index) => (
            <div
              className="carousel-item"
              key={index}
              onClick={() => openModal(img)}
            >
              <img src={img} alt={`slide-${index}`} />
            </div>
          ))}
        </div>
      </section>

      {selectedImg && (
        <div className="carousel-modal-overlay" onClick={closeModal}>
          <div
            className="carousel-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="carousel-modal-close" onClick={closeModal}>
              &times;
            </button>
            <img src={selectedImg} alt="expanded-slide" />
          </div>
        </div>
      )}
    </>
  );
}

export default Carousel;