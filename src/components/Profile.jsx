import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Profile = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        studentId: "",
        role: "",
        password: "",
        confirmPassword: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                studentId: user.studentId || "",
                role: user.role || "",
                password: user.password || "",
                confirmPassword: user.password || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // Update user object
        const updatedUser = {
            ...user,
            name: formData.name,
            password: formData.password,
        };

        // Update localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = existingUsers.map((u) =>
            u.email === user.email ? updatedUser : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        // Update App state
        setUser(updatedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully! 💾");
    };

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>👤 My Profile</h1>
                </div>

                <div className="dashboard-content" style={{ display: "block", maxWidth: "800px", margin: "0 auto" }}>
                    <div className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div className="student-avatar" style={{ width: "64px", height: "64px", fontSize: "2rem" }}>
                                    {formData.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0 }}>{formData.name}</h2>
                                    <p style={{ margin: 0 }}>{formData.role}</p>
                                </div>
                            </div>
                            {!isEditing && (
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                    Edit Profile ✏️
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    disabled={true} // Email usually shouldn't be changed easily as it's the ID
                                    style={{ backgroundColor: "var(--color-surface-alt)", cursor: "not-allowed" }}
                                />
                                <p className="form-help-text">Email cannot be changed.</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Student ID</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    className="form-control"
                                    value={formData.studentId}
                                    disabled={true}
                                    style={{ backgroundColor: "var(--color-surface-alt)", cursor: "not-allowed" }}
                                />
                            </div>

                            {isEditing && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="modal-actions" style={{ marginTop: "2rem" }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset form to current user state
                                                setFormData({
                                                    ...formData,
                                                    name: user.name,
                                                    password: user.password,
                                                    confirmPassword: user.password,
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">
                                            Save Changes
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>

                    <div className="card" style={{ marginTop: "2rem" }}>
                        <h3>⚙️ Account Settings</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h4>Email Notifications</h4>
                                    <p style={{ margin: 0, fontSize: "0.9rem" }}>Receive updates about your wellness programs.</p>
                                </div>
                                <div className="form-checkbox">
                                    <input type="checkbox" defaultChecked />
                                </div>
                            </div>
                            <hr style={{ border: "none", borderTop: "1px solid var(--color-border)" }} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h4>Dark Mode</h4>
                                    <p style={{ margin: 0, fontSize: "0.9rem" }}>Switch between light and dark themes.</p>
                                </div>
                                <div className="form-checkbox">
                                    <input type="checkbox" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
