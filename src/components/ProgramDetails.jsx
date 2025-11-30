import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProgramDetails = ({ user, studentData, enrollInProgram, leaveProgram, programs }) => {
  const { programId } = useParams();
  const navigate = useNavigate();

  // Find program from the passed programs prop
  const data = programs?.find(p => p.id === programId);

  // Map old data structure if needed, or ensure new structure has all fields.
  // The new structure in App.jsx has: title, detailedDescription (as desc), img, duration, level.
  // We need to make sure 'desc' in this component maps to 'detailedDescription' or 'description'.
  // Let's normalize it here for the view.
  const displayData = data ? {
    ...data,
    desc: data.detailedDescription || data.description, // Fallback to short desc if detailed is missing
  } : null;

  const handleStartProgram = () => {
    toast.success(`Successfully enrolled in ${displayData.title}! 🚀`);
    // In a real app, this would update the backend
  };

  if (!displayData) {
    return (
      <div className="page-wrapper center">
        <h1>Program Not Found 😢</h1>
        <button
          className="btn btn-outline"
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <button
        className="btn btn-outline"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
        aria-label="Go back to dashboard"
      >
        ← Back
      </button>

      <div className="program-card">
        <div className="detail-image">
          <img
            src={displayData.img}
            alt={displayData.title}
          />
        </div>

        <div className="program-content">
          <h1 className="program-title">{displayData.title}</h1>

          <div className="program-meta">
            <span className="badge badge-blue">
              ⏱ {displayData.duration}
            </span>
            <span className="badge badge-green">
              📊 {displayData.level}
            </span>
          </div>

          <p className="program-desc">
            {displayData.desc}
          </p>

          <div className="action-buttons-lg">
            {studentData?.enrolledPrograms?.includes(programId) ? (
              <button
                className="btn btn-outline btn-lg"
                onClick={() => {
                  if (window.confirm("Are you sure you want to leave this program?")) {
                    leaveProgram(studentData.id, programId);
                    toast.success(`You have left ${displayData.title}.`);
                  }
                }}
                style={{ borderColor: 'var(--color-text-secondary)', color: 'var(--color-text-secondary)' }}
                aria-label={`Leave ${displayData.title} program`}
              >
                Enrolled (Leave)
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  if (user?.role === "Student") {
                    enrollInProgram(studentData.id, programId);
                    toast.success(`Successfully enrolled in ${displayData.title}! 🚀`);
                  } else {
                    toast.error("Please sign in to enroll.");
                    navigate("/signin");
                  }
                }}
                aria-label={`Start ${displayData.title} program`}
              >
                Start Program 🚀
              </button>
            )}
            <button
              className="btn btn-outline"
              onClick={() => toast("Added to your wishlist! ❤️")}
              aria-label={`Add ${displayData.title} to wishlist`}
            >
              Save for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
