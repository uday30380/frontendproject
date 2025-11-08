import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const programInfo = {
  "mental-health": {
    title: "Mental Health Support",
    desc: "Access 24/7 counseling sessions with certified professionals. Our trained counselors help manage stress, anxiety, and emotional well-being.",
    img: "https://images.unsplash.com/photo-1588776814546-6d4f9b4ef7b0?w=800",
  },
  "fitness-programs": {
    title: "Fitness Programs",
    desc: "Join yoga, HIIT, and cardio sessions to stay fit. Get personalized routines and weekly progress tracking with expert trainers.",
    img: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800",
  },
  "nutrition-guidance": {
    title: "Nutrition Guidance",
    desc: "Follow customized diet plans, track calories, and improve your energy levels with our nutritionist-backed health guides.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  },
  "community-support": {
    title: "Community Support",
    desc: "Connect with peers, share experiences, and stay motivated in your wellness journey through our active community network.",
    img: "https://images.unsplash.com/photo-1515169067865-5387ec356754?w=800",
  },
  "daily-challenges": {
    title: "Daily Challenges",
    desc: "Stay motivated with daily wellness challenges like hydration tracking, meditation, and fitness goals.",
    img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800",
  },
};

const ProgramDetails = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const data = programInfo[programId];

  if (!data) {
    return (
      <div className="page-wrapper">
        <h1>Program Not Found 😢</h1>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>{data.title}</h1>
        <p>{data.desc}</p>
      </div>

      <div className="detail-image">
        <img src={data.img} alt={data.title} />
      </div>

      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default ProgramDetails;
