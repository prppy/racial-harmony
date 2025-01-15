const express = require("express");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 5001;
const serviceAccount = require("./firebaseServiceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const cors = require('cors');

// Enable CORS for all origins (or specific origins)
app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to create users
app.post("/createBatchUsers", async (req, res) => {
  try {
    const { users } = req.body; // Array of users to create

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ error: "Invalid users data" });
    }

    const createdUsers = [];
    const errors = [];

    for (const user of users) {
      try {
        // Generate password from name + birthday
        const password = `${user.name}${user.birthday}`;

        // Create user in Firebase Authentication
        const newUser = await admin.auth().createUser({
          email: user.email,
          password: password,
          displayName: user.name,
        });

        // Store user data in Firestore
        await admin.firestore().collection("users").doc(newUser.uid).set({
          name: user.name,
          email: user.email,
          userId: newUser.uid,
          admin: user.admin || false,
          voucher_balance: 0, // Set initial values as needed
          bg: 0, // Set background default value
          default_password: password,
          admission_date: new Date(user.admission_date),
          class: user.class,
        });


        createdUsers.push({ uid: newUser.uid, email: newUser.email });
      } catch (error) {
        errors.push({ email: user.email, error: error.message });
      }
    }

    // Respond with success or failure info
    res.json({
      success: errors.length === 0,
      createdUsers,
      errors,
    });
  } catch (error) {
    console.error("Error in createBatchUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


{/* DELETE USER */}
app.delete("/deleteUser/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(userId);

    // Delete user data from Firestore
    await admin.firestore().collection("users").doc(userId).delete();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

{/* RESET PASSWORD */}
app.post("/resetPassword/:userId", async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body; // Expect a new password in the request body

  try {
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // Update the user's password in Firebase Authentication
    await admin.auth().updateUser(userId, { password: newPassword });

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
