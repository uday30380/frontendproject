import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PaymentModal from "./PaymentModal";

const ProgramDetails = ({ user, studentData, enrollInProgram, leaveProgram, programs, addTransaction }) => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  // Rating State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (star) => {
    setRating(star);
    toast.success(`You rated this program ${star} stars! 🌟`);
  };

  // Find program from the passed programs prop
  const data = programs?.find(p => p.id === programId);

  // Map old data structure if needed, or ensure new structure has all fields.
  const displayData = data ? {
    ...data,
    desc: data.detailedDescription || data.description,
    isPremium: data.isPremium || false, // Check if premium
    price: data.price || 19.99
  } : null;

  if (!displayData) {
    return (
      <div className="page-wrapper center">
        <h1>Program Not Found 😢</h1>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const handleEnrollClick = () => {
    if (!user?.role) {
      toast.error("Please sign in to enroll.");
      navigate("/signin");
      return;
    }
    if (user.role === "Admin") {
      toast.error("Admins cannot enroll in programs.");
      return;
    }

    if (displayData.isPremium) {
      setShowPayment(true);
    } else {
      enrollInProgram(studentData.id, programId);
    }
  };

  const onPaymentSuccess = (amount) => {
    setShowPayment(false);
    enrollInProgram(studentData.id, programId);
    addTransaction({
      userId: user.uid,
      userName: user.name,
      programId: programId,
      programTitle: displayData.title,
      amount: amount,
      type: "Enrollment"
    });
    toast.success(`Payment Successful! Enrolled in ${displayData.title} 💎`);
  };

  return (
    <div className="page-wrapper">
      <button
        className="btn btn-outline"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem" }}
      >
        ← Back
      </button>

      <div className="program-card">
        <div className="detail-image">
          <img src={displayData.img} alt={displayData.title} />
        </div>

        <div className="program-content">
          <div className="flex justify-between items-start">
            <h1 className="program-title">{displayData.title}</h1>
            {displayData.isPremium && <span className="badge badge-warning text-lg">💎 Premium</span>}
          </div>

          <div className="program-meta">
            <span className="badge badge-blue">⏱ {displayData.duration}</span>
            <span className="badge badge-green">📊 {displayData.level}</span>
          </div>

          <p className="program-desc">{displayData.desc}</p>

          <div className="action-buttons-lg">
            {studentData?.enrolledPrograms?.includes(programId) ? (
              <button
                className="btn btn-outline btn-lg"
                onClick={() => {
                  if (window.confirm("Are you sure you want to leave this program?")) {
                    leaveProgram(studentData.id, programId);
                  }
                }}
                style={{ borderColor: 'var(--color-text-secondary)', color: 'var(--color-text-secondary)' }}
              >
                Enrolled (Leave)
              </button>
            ) : (
              <button
                className={`btn btn-lg ${displayData.isPremium ? 'btn-game-accent' : 'btn-primary'}`}
                onClick={handleEnrollClick}
              >
                {displayData.isPremium ? `Buy Now $${displayData.price}` : 'Start Program 🚀'}
              </button>
            )}

            <div className="glass-panel mt-4 p-4 flex flex-col items-center w-full">
              <h3 className="mb-2 m-0">Rate this Program</h3>
              <div className="flex gap-2 cursor-pointer">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-2xl transition-colors ${(hoverRating || rating) >= star ? 'text-warning' : 'text-muted'}`}
                    style={{ color: (hoverRating || rating) >= star ? '#ffd700' : '#ccc' }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <button className="btn btn-outline" onClick={() => toast("Added to your wishlist! ❤️")}>
              Save for Later
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          program={displayData}
          user={user}
          onClose={() => setShowPayment(false)}
          onSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
};

export default ProgramDetails;
