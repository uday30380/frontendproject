import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { firebaseApi } from "../api/firebaseApi";

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

    const handleSave = async (e) => {
        e.preventDefault();

        // 1. Password Update Logic
        if (formData.password) {
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match!");
                return;
            }
            try {
                await firebaseApi.updateUserPassword(formData.password);
                toast.success("Password updated successfully! 🔐");
            } catch (error) {
                console.error("Password update failed", error);
                toast.error("Failed to update password. You may need to re-login.");
                return;
            }
        }

        // 2. Profile Data Update Logic (Local for now, or sync extended profile)
        // Ideally this should also call an API, but for now we stick to the requested Password flow primarily.

        const updatedUser = {
            ...user,
            name: formData.name,
            department: formData.department,
            year: formData.year,
            // Don't store password in plain text object/local storage if possible, but keeping for legacy compatibility if needed
            avatar: formData.avatar
        };

        // Update App state
        setUser(updatedUser);
        setIsEditing(false);
        toast.success("Profile details updated! 💾");
    };

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-container">
                <div className="dashboard-header-premium glass-panel p-8 mb-8">
                    <h1 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400" style={{ background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        👤 My Profile
                    </h1>
                    <p className="text-lg opacity-90 m-0">Manage your personal details and account settings.</p>
                </div>

                <div className="dashboard-content max-w-4xl mx-auto block">
                    <div className="card glass-panel p-10">
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-6">
                                <div className="profile-avatar-container">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Profile" className="profile-avatar-img" />
                                    ) : (
                                        formData.name.charAt(0)
                                    )}
                                    {isEditing && (
                                        <label htmlFor="avatar-upload" className="profile-avatar-overlay">
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
                                    <h2 className="text-3xl m-0">{formData.name}</h2>
                                    <p className="text-lg opacity-80 mt-2">{formData.role} • {formData.department || "No Dept"}</p>
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
                                    className="form-control p-4"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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

                            <div className="form-group mb-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control bg-white/5 cursor-not-allowed opacity-70"
                                    value={formData.email}
                                    disabled={true}
                                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Student ID</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    className="form-control bg-white/5 cursor-not-allowed opacity-70"
                                    value={formData.studentId}
                                    disabled={true}
                                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                />
                            </div>

                            {isEditing && (
                                <div className="mt-12 p-8 bg-white/5 rounded-lg border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <h4 className="text-xl mb-6">🔐 Change Password</h4>
                                    <div className="form-group mb-6">
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

                                    <div className="flex justify-end gap-4 mt-10">
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
                                        <button type="submit" className="btn btn-success min-w-[150px]">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="card glass-panel mt-12 p-10">
                        <h3 className="text-2xl mb-6">⚙️ Account Settings</h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg">Email Notifications</h4>
                                    <p className="text-sm opacity-70 mt-1">Receive updates about your wellness programs.</p>
                                </div>
                                <div className="form-checkbox">
                                    <input type="checkbox" defaultChecked />
                                </div>
                            </div>
                            <hr className="border-none border-t border-white/10" />
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg">Dark Mode</h4>
                                    <p className="text-sm opacity-70 mt-1">Switch between light and dark themes.</p>
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
