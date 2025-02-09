import React, { useEffect, useState } from "react";
import {
    fetchMainCollection,
    fetchMainRecord,
    updateMainRecord,
} from "../utils/firebaseUtils"; // Add necessary fetch functions
import { FaTimes, FaCheck } from "react-icons/fa";
import { DARK_GRAY, DARK_GREEN, DARK_PURPLE, RED } from "../constants/colors";
import "../styles/tableStyles.css";

const ApplicationsTable = ({ user, taskId, columns }) => {
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [statusFilter, setStatusFilter] = useState("pending"); // Default filter is 'pending'
    const [taskData, setTaskData] = useState(null);
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchMainCollection("users");
                setUsers(userData);

                const taskData = await fetchMainCollection("tasks");
                setAllTasks(taskData);

                if (taskId) {
                    const taskDetails = await fetchMainRecord("tasks", taskId);
                    setTaskData(taskDetails);
                }
                // Filter for admins
                const adminData = userData.filter((user) => user.admin);
                setAdmins(adminData);

                const allApplications = await fetchMainCollection(
                    "applications"
                );
                let taskApplications = taskId
                    ? allApplications.filter((app) => app.taskId === taskId)
                    : allApplications; // Use all tasks if no taskId

                if (user?.class) {
                    // Filter applications by class if the admin has one
                    const filteredApplications = taskApplications.filter(
                        (app) => app.class === user.class
                    );
                    setApplications(filteredApplications);
                } else {
                    // Show all applications if no class
                    setApplications(taskApplications);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    const getTaskName = (taskId) => {
        const task = allTasks.find((task) => task.id === taskId);
        return task ? task.title : "Unknown Task";
    };

    const handleApprove = async (applicationId, residentID) => {
        await updateMainRecord("applications", applicationId, {
            status: "approved",
            statusUpdateDate: new Date().toISOString(),
        });

        const residentRecord = await fetchMainRecord("users", residentID);
        let voucher_balance = residentRecord.voucher_balance || 0;
        voucher_balance += taskData.points;
        await updateMainRecord("users", residentID, {
            voucher_balance: voucher_balance,
        });

        alert("Application approved successfully!");
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId
                    ? {
                          ...app,
                          status: "approved",
                          statusUpdateDate: new Date().toISOString(),
                      }
                    : app
            )
        );
    };

    const handleReject = async (applicationId) => {
        await updateMainRecord("applications", applicationId, {
            status: "rejected",
            statusUpdateDate: new Date().toISOString(),
        });
        alert("Application rejected successfully!");
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId
                    ? {
                          ...app,
                          status: "rejected",
                          statusUpdateDate: new Date().toISOString(),
                      }
                    : app
            )
        );
    };

    const getResidentName = (residentId) => {
        const resident = users.find((user) => user.userId === residentId);
        return resident ? resident.name : "Unknown";
    };

    const getFormTeacher = (className) => {
        const formTeacher = admins.find((admin) => admin.class === className);
        return formTeacher ? formTeacher.name : "No form teacher";
    };

    const filteredApplications = applications.filter(
        (application) =>
            application.status === statusFilter || statusFilter === "all"
    );

    return (
        <div style={pageStyles.outerContainer}>
            <label>
                Filter by Status:
                <select
                    style={{ marginLeft: "10px" }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </label>

            <div
                style={{
                    overflow: "auto",
                    maxHeight: "400px",
                    marginTop: "20px",
                }}
            >
                <table style={pageStyles.table}>
                    <thead>
                        <tr>
                            <th style={pageStyles.th}>Resident Name</th>
                            {columns.includes("taskName") && (
                                <th style={pageStyles.th}>Task Name</th>
                            )}
                            {columns.includes("class") && (
                                <th style={pageStyles.th}>Class</th>
                            )}
                            {columns.includes("formTeacher") && (
                                <th style={pageStyles.th}>Form Teacher</th>
                            )}
                            <th style={pageStyles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map((application, index) => (
                            <tr
                                key={application.id}
                                className={
                                    index % 2 === 0 ? "odd-row" : "even-row"
                                }
                            >
                                <td style={pageStyles.td}>
                                    {getResidentName(application.residentID)}
                                </td>
                                {columns.includes("taskName") && (
                                    <td style={pageStyles.td}>
                                        {getTaskName(application.taskId)}
                                    </td>
                                )}
                                {columns.includes("class") && (
                                    <td style={pageStyles.td}>
                                        {application.class}
                                    </td>
                                )}
                                {columns.includes("formTeacher") && (
                                    <td style={pageStyles.td}>
                                        {getFormTeacher(application.class)}
                                    </td>
                                )}
                                <td style={pageStyles.td}>
                                    {application.status === "pending" ? (
                                        <div style={pageStyles.actionButtons}>
                                            <button
                                                style={{
                                                    ...pageStyles.button,
                                                    backgroundColor: DARK_GREEN,
                                                }}
                                                onClick={() =>
                                                    handleApprove(
                                                        application.id,
                                                        application.residentID
                                                    )
                                                }
                                            >
                                                <FaCheck
                                                    style={{
                                                        marginRight: "8px",
                                                    }}
                                                />{" "}
                                                Approve
                                            </button>
                                            <button
                                                style={{
                                                    ...pageStyles.button,
                                                    backgroundColor: RED,
                                                }}
                                                onClick={() =>
                                                    handleReject(application.id)
                                                }
                                            >
                                                <FaTimes
                                                    style={{
                                                        marginRight: "8px",
                                                    }}
                                                />{" "}
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            style={pageStyles.disabledButton}
                                            disabled
                                        >
                                            {application.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                application.status.slice(1)}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredApplications.length === 0 && <p>No applications</p>}
            </div>
        </div>
    );
};
const pageStyles = {
    outerContainer: {
        color: DARK_PURPLE,
        overflow: "auto",
        maxHeight: "400px",
        width: "100%",
    },
    actionButtons: {
        display: "flex",
        gap: "10px", // Space between buttons
    },
    button: {
        backgroundColor: DARK_GREEN,
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "10px 20px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "115px",
        textAlign: "center",
    },
    disabledButton: {
        backgroundColor: DARK_GRAY,
        color: "white",
        cursor: "not-allowed",
        width: "115px",
        textAlign: "center",
        border: "none",
        borderRadius: "10px",
        padding: "10px 20px",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        backgroundColor: "#f4f4f4",
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #ddd",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #ddd",
        textAlign: "left",
    },
};

export default ApplicationsTable;
