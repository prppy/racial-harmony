import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderComp from "../components/SliderComps";
import { useAuth } from "../context/authContext";
import { DARK_PURPLE, RED, DARK_GREEN } from "../constants/colors";

const HistoryPage = () => {
    return (
        <div style={styles.pageContainer}>
            hello history
        </div>
    );
};

const styles = {
    pageContainer: {
        padding: "50px",
    },
    left: {
        width: "60%",
        border: "2px solid black",
        flexDirection: "column",
        boxSizing: "border-box",
    },
    right: {
        border: `2px solid ${DARK_PURPLE}`,
        justifyItems: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "25px",
        boxSizing: "border-box",
        color: DARK_PURPLE,
    },
    points: {
        display: "flex",
        width: "100px",
        backgroundColor: DARK_GREEN,
        borderRadius: "10px",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "end",
        fontSize: "16px",
        padding: "10px",
        boxSizing: "border-box",
    },
    slide: {
        border: "2px solid black",
        width: "100%",
    },
};

export default HistoryPage;
