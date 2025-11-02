export const initializeUserProfile = async (uid, email, username) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        profileCompleted: false,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to initialize user profile");
    return data;
  } catch (err) {
    console.error("Error initializing profile:", err);
    throw err;
  }
};
