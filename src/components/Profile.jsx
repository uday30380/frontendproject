import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Profile = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        studentId: "",
        role: "",
        department: "",
        year: "",
        password: "",
        confirmPassword: "",
        avatar: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                studentId: user.studentId || "",
                role: user.role || "",
                department: user.department || "",
                year: user.year || "",
                password: user.password || "",
                confirmPassword: user.password || "",
                avatar: user.avatar || ""
            });
            setPreviewImage(user.avatar || null);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
            department: formData.department,
            year: formData.year,
            password: formData.password,
            avatar: formData.avatar
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
                                <div className="student-avatar" style={{ width: "80px", height: "80px", fontSize: "2.5rem", position: "relative", overflow: "hidden" }}>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        formData.name.charAt(0)
                                    )}
                                    {isEditing && (
                                        <label htmlFor="avatar-upload" style={{
                                            position: "absolute", bottom: 0, left: 0, right: 0,
                                            background: "rgba(0,0,0,0.6)", color: "white", fontSize: "0.8rem",
                                            textAlign: "center", cursor: "pointer", padding: "2px"
                                        }}>
                                            📷
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={handlePhotoUpload}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <h2 style={{ margin: 0 }}>{formData.name}</h2>
                                    <p style={{ margin: 0, opacity: 0.8 }}>{formData.role} • {formData.department || "No Dept"}</p>
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

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        className="form-control"
                                        value={formData.department}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year / Semester</label>
                                    <input
                                        type="text"
                                        name="year"
                                        className="form-control"
                                        value={formData.year}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="e.g. 3rd Year"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    disabled={true}
                                    style={{ backgroundColor: "var(--color-surface-alt)", cursor: "not-allowed" }}
                                />
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
                                <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--color-surface-alt)", borderRadius: "var(--radius-md)" }}>
                                    <h4 style={{ marginBottom: "1rem" }}>🔐 Change Password</h4>
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
                                                setFormData({
                                                    ...formData,
                                                    name: user.name,
                                                    department: user.department,
                                                    year: user.year,
                                                    password: user.password,
                                                    confirmPassword: user.password,
                                                    avatar: user.avatar
                                                });
                                                setPreviewImage(user.avatar || null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
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
