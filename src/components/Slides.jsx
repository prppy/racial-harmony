import React from "react";
import { DARK_PURPLE, RED } from "../constants/colors";

export const VoucherSlide = ({ voucher }) => {
    return (
        <div style={styles.container}>
            <img
                src={voucher.imageUrl ? voucher.imageUrl : "/bg0.png"}
                alt={voucher.title}
                style={styles.image}
            />
            <div style={styles.desc}>
                <h3 style={{ color: DARK_PURPLE, fontSize: "20px" }}>
                    {voucher.title}
                </h3>
                <h3 style={{ color: RED, fontSize: "16px" }}>
                    {voucher.points}pts
                </h3>
            </div>
        </div>
    );
};

export const ProductSlide = ({ product }) => {
    return (
        <div style={styles.container}>
            <img
                src={product.productImageUrl ? product.productImageUrl : "/bg0.png"}
                alt={product.name}
                style={styles.image}
            />
            <div style={styles.desc}>
                <h3 style={{ color: DARK_PURPLE, fontSize: "20px" }}>
                    {product.name}
                </h3>
                <h3 style={{ color: RED, fontSize: "16px" }}>
                    {product.price}pts
                </h3>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: "250px",
        borderRadius: "10px",
        cursor: "pointer",
        margin: "0 25px",
        position: "relative",
        overflow: "hidden",
        border: `2px solid ${DARK_PURPLE}`,
        backgroundColor: "white",
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
    },
    desc: {
        textAlign: "center",
    },
};
