import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { VoucherSlide, ProductSlide } from "./Slides";

export const VoucherSliderComp = ({ vouchers }) => {
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1350,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            }
        ],
    };

    return (
        <Slider {...settings}>
            {vouchers.map((voucher) => {
                return <VoucherSlide voucher={voucher} />;
            })}
        </Slider>
    );
};

export const ProductSliderComp = ({ products }) => {
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1350,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            }
        ],
    };

    return (
        <Slider {...settings}>
            {products.map((product) => {
                return <ProductSlide product={product} />;
            })}
        </Slider>
    );
};

