import React from "react";
import { DARK_PURPLE, LIGHT_PURPLE, RED } from "../constants/colors";
import { useNavigate } from "react-router-dom";

export const VoucherSlide = ({ voucher, style, onClick }) => {

    return (
        <div
            style={{ ...styles.container, ...style }}
            onClick={onClick}
        >
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

export const VoucherAdminSlide = ({ voucher, style, onClick }) => {
    return (
        <div style={{ ...styles.container, ...style }} onClick={onClick}>
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

export const ProductSlide = ({ product, style }) => {
    const navigate = useNavigate();

    return (
        <div style={{ ...styles.container, ...style }} onClick={() => {
            navigate(`/product/${product.id}`, {
                state: { product: product },
            });
        }}>
            <img
                src={
                    product.productImageUrl
                        ? product.productImageUrl
                        : "/bg0.png"
                }
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

export const ProductAdminSlide = ({ product, style, onClick }) => {
    return (
        <div style={{ ...styles.container, ...style }} onClick={() => {}}>
            <img
                src={
                    product.productImageUrl
                        ? product.productImageUrl
                        : "/bg0.png"
                }
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
        aspectRatio: "7 / 5",
        width: "350px", // Adjust dynamically for 2 slides
        borderRadius: "10px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        border: `2px solid ${DARK_PURPLE}`,
        backgroundColor: "white",
        boxSizing: "border-box",
    },
    image: {
        width: "100%",
        height: "60%",
        objectFit: "contain",
        backgroundColor: LIGHT_PURPLE,
    },
    desc: {
        height: "100px", // Adjust height as needed
        textAlign: "center", // Horizontal alignment for text content
        justifyContent: "center", // Horizontally center content
        alignItems: "center", // Vertically center content
        textOverflow: "ellipsis", // Optional: Handle long text
    },
};
