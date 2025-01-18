import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DARK_PURPLE, LIGHT_PURPLE, RED } from "../constants/colors";
import {
    updateMainRecord,
    fetchMainRecord,
    createMainRecord,
} from "../utils/firebaseUtils";
import { IoMdHeartDislike } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";

import { useAuth } from "../context/authContext";

const VoucherView = () => {
    const location = useLocation();
    const task = location.state?.task;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isFavourite, setIsFavourite] = useState(false);
    const [applied, setApplied] = useState(false);

    const [userData, setUserData] = useState(null);
    const taskId = task.id;

    useEffect(() => {
        if (!task) {
            console.error("Task not found!");
            return;
        }

        const fetchData = async () => {
            try {
                const userData = await fetchMainRecord("users", user.userId);
                setUserData(userData);
                if (
                    userData?.favouriteTasks &&
                    userData.favouriteTasks.includes(taskId)
                ) {
                    setIsFavourite(true);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (user && task) {
            fetchData();
        }
    }, [task, user]);

    if (!task) {
        return <div>Task not found. Please go back and try again.</div>;
    }

    const handleFavourite = async () => {
        if (!user?.userId || !taskId) {
            console.error("Missing user or taskId");
            return;
        }

        try {
            const userData = await fetchMainRecord("users", user.userId);
            const favouriteTasks = userData?.favouriteTasks || [];

            if (isFavourite) {
                const updatedFavouriteTasks = favouriteTasks.filter(
                    (id) => id !== taskId
                );

                await updateMainRecord("users", user.userId, {
                    favouriteTasks: updatedFavouriteTasks,
                });

                setIsFavourite(false); // Mark as not favourited
                alert("Task removed from favourites!");
            } else {
                // Add the taskId to the favouriteTasks array if not already present
                if (!favouriteTasks.includes(taskId)) {
                    favouriteTasks.push(taskId);

                    // Update the user's favouriteTasks field in Firestore
                    await updateMainRecord("users", user.userId, {
                        favouriteTasks: favouriteTasks,
                    });

                    setIsFavourite(true);
                    alert("Task added to favourites!");
                }
            }
        } catch (error) {
            console.error("Error updating task favourite status:", error);
        }
    };

    const handleApply = async () => {
        if (!user?.userId || !taskId) {
            console.error("Missing user or taskId");
            return;
        }
        try {
            const application = {
                residentID: user?.userId,
                status: "pending",
                taskId: taskId,
                class: userData?.class || "N/A",
                applicationDate: new Date(),
            };
            await createMainRecord("applications", application);
            alert("Application submitted successfully!");
            setApplied(true);
        } catch (e) {
            alert("Error applying for this task! Please try again later");
            console.log(e);
        }
    };
    return (
        <div style={styles.container}>
            <div style={styles.leftContainer}>
                {task.imageUrl ? (
                    <img
                        src={task.imageUrl}
                        alt={task.title}
                        style={styles.image}
                    />
                ) : (
                    <div
                        style={{ ...styles.image, ...styles.placeholder }}
                    ></div>
                )}
            </div>
            <div style={styles.rightContainer}>
                <h1 className="large-heading" style={{ color: DARK_PURPLE }}>
                    {task.title}
                </h1>
                <hr style={styles.divider} />
                <div style={styles.subContainer}>
                    <div style={styles.detailsContainer}>
                        <p style={styles.points}>
                            <strong>
                                <span style={{ fontSize: "30px" }}>
                                    {task.points}
                                </span>
                                pts
                            </strong>
                        </p>
                        <p style={styles.description}>
                            Description:{" "}
                            <span style={{ fontSize: "16px" }}>
                                {task.description}
                            </span>
                        </p>
                        <p style={styles.description}>
                            Category:{" "}
                            <span style={{ fontSize: "16px" }}>
                                {task.category.charAt(0).toUpperCase() +
                                    task.category.slice(1)}
                            </span>
                        </p>

                        <p style={{ ...styles.description, color: RED, margin: 0, }}>
                            Due By:{" "}
                            <span style={{ fontSize: "16px" }}>
                                {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                    <div style={styles.buttonContainer}>
                        <div style={{ flexGrow: 1 }} />{" "}
                        <button
                            style={{
                                ...styles.editButton,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: isFavourite ? "gray" : RED, // Change color if favorited
                                cursor: "pointer",
                            }}
                            onClick={handleFavourite}
                        >
                            {isFavourite ? (
                                <IoMdHeartDislike
                                    color="white"
                                    style={{ marginRight: "10px" }}
                                /> // Use dislike icon when favorited
                            ) : (
                                <IoMdHeart
                                    color="white"
                                    style={{ marginRight: "10px" }}
                                /> // Use heart icon when not favorited
                            )}
                            <span style={{ color: "white" }}>
                                {isFavourite ? "Unfavourite" : "Favourite"}
                            </span>
                        </button>
                        {!applied ? (
                            <button
                                style={styles.applyButton}
                                onClick={handleApply}
                            >
                                Apply
                            </button>
                        ) : (
                            <button
                                style={{
                                    ...styles.applyButton,
                                    backgroundColor: "gray",
                                }}
                                onClick={handleApply}
                                disabled
                            >
                                Applied
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch", // Ensures both containers are the same height
        borderRadius: "10px",
        margin: "50px",
        boxSizing: "border-box",
        flexWrap: "wrap", // Allow for wrapping on smaller screens
    },
    leftContainer: {
        flex: 1, // Ensures both containers grow to fill available space
        display: "flex",
        marginRight: "25px",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: LIGHT_PURPLE,
        borderRadius: "10px",
        border: `2px solid ${DARK_PURPLE}`,
        boxSizing: "border-box",
    },
    rightContainer: {
        flex: 1, // Ensures both containers grow to fill available space
        display: "flex",
        marginLeft: "25px",
        justifyContent: "flex-start",
        flexDirection: "column", // Aligns the details container and button container vertically
        alignItems: "flex-start",
        padding: "25px",
        border: `2px solid ${DARK_PURPLE}`,
        borderRadius: "10px",
        boxSizing: "border-box",
        backgroundColor: "white",
    },
    subContainer: {
        display: "flex",
        flexDirection: "row", // Aligns the details container and button container horizontally
        alignItems: "flex-start",
        width: "100%",
        flexWrap: "wrap", // Wrap contents for smaller screens
    },
    detailsContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column", // Stack the buttons vertically
        flex: 1, // Ensure the container stretches to fill available space
        width: "auto",
        maxWidth: "25%",
        justifyContent: "flex-end", // Push the buttons to the bottom
        marginTop: "auto", // Ensures the container takes up remaining space
        minWidth: "150px"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        objectFit: "cover",
    },
    placeholder: {
        backgroundColor: "#868bbd",
    },
    divider: {
        width: "100%",
        border: "1px solid #2a2a72",
        marginBottom: "25px",
    },
    points: {
        fontSize: "20px",
        color: RED,
        marginBottom: "25px",
        marginTop: "0",
    },
    description: {
        fontSize: "20px",
        color: DARK_PURPLE,
        marginTop: "0px",
        marginBottom: "25px", // Remove margin to prevent extra space
        display: "inline-block", // Makes both lines inline without extra vertical space
    },
    editButton: {
        backgroundColor: RED,
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "10px 20px",
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: "25px",
    },
    applyButton: {
        backgroundColor: "#1c660d",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "10px 20px",
        cursor: "pointer",
        fontWeight: "bold",

    },
};

export default VoucherView;