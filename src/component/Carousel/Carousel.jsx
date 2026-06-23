import React from "react";
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
// import img13 from "../../assets/carousel/13.jpg";

const images = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    //   img13,
];

function Carousel() {
    return (
        <>
            <div className="past">Past Activities Pictures</div>
            <section className="carousel-section">
                <div className="carousel-track">
                    {[...images, ...images].map((img, index) => (
                        <div className="carousel-item" key={index}>
                            <img src={img} alt={`slide-${index}`} />
                        </div>
                    ))}
                </div>
            </section >
        </>
    );
}

export default Carousel;