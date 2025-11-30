// ✅ Mock API Service to simulate backend interactions
// Simulates network delay and random errors for "Level 5" integration

const DELAY_MS = 1500; // 1.5 seconds delay to show loading state

// Helper to simulate async call
const mockFetch = (data, shouldFail = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Network Error: Failed to fetch data."));
            } else {
                resolve(data);
            }
        }, DELAY_MS);
    });
};

// Initial Data (Moved from App.jsx default states)
const initialStudents = [
    {
        id: 101,
        name: "Vempati Uday Kiran",
        department: "CSE",
        wellnessScore: 72,
        stress: 8,
        activity: "Moderate",
        sleep: 5.5,
        challenges: [
            { name: "15-Minute Meditation", progress: 75, total: 100 },
            { name: "Drink 8 Glasses of Water", progress: 5, total: 8 },
        ],
        events: [
            { name: "Stress Management Workshop", joined: true },
            { name: "Stress Management Workshop", joined: true },
            { name: "Yoga & Mindfulness", joined: false },
        ],
        enrolledPrograms: [],
        savedResources: [],
        messages: [
            {
                from: "Admin",
                text: "Let's schedule a counseling session next Monday.",
                time: "10:00 AM",
                read: false,
            },
        ],
    },
    {
        id: 102,
        name: "Jane Doe",
        department: "ECE",
        wellnessScore: 85,
        stress: 4,
        activity: "High",
        sleep: 7,
        challenges: [],
        events: [],
        enrolledPrograms: [],
        savedResources: [],
        messages: [],
    },
];

const initialResources = [
    { id: 1, title: "Managing Exam Stress", type: "Article", category: "Mental Health", content: "..." },
    { id: 2, title: "10-Minute Yoga for Focus", type: "Video", category: "Physical Health", content: "..." },
    { id: 3, title: "Healthy Eating on a Budget", type: "Guide", category: "Nutrition", content: "..." },
];

const initialPrograms = [
    {
        id: "mindfulness-101",
        title: "Mindfulness 101",
        category: "Mental",
        icon: "🧘",
        color: "var(--color-primary-light)",
        textColor: "var(--color-primary)",
        description: "A 4-week journey to reduce stress and improve focus through meditation.",
        detailedDescription: "Master the art of mindfulness with daily guided meditations.",
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
        duration: "4 Weeks",
        level: "Beginner",
    },
    {
        id: "nutrition-guidance",
        title: "Nutrition Basics",
        category: "Lifestyle",
        icon: "🥗",
        color: "var(--color-danger-bg)",
        textColor: "var(--color-danger)",
        description: "Simple guides and meal plans for a balanced, energetic student life.",
        detailedDescription: "Follow customized diet plans, track calories, and improve your energy levels.",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        duration: "6 Weeks",
        level: "Beginner",
    },
];

const initialAnnouncements = [
    {
        id: 1,
        title: "Welcome to the New Term! 🎉",
        content: "We are excited to start a new journey with you.",
        type: "Info",
        date: new Date().toLocaleDateString(),
    },
    {
        id: 2,
        title: "Maintenance Alert ⚠️",
        content: "The system will be down for maintenance on Sunday from 2 AM to 4 AM.",
        type: "Alert",
        date: new Date().toLocaleDateString(),
    }
];

const initialAppointments = [
    { id: 1, studentId: 101, studentName: "Vempati Uday Kiran", type: "Counseling", date: "2023-10-25", status: "Pending", notes: "" },
    { id: 2, studentId: 102, studentName: "Jane Doe", type: "Nutrition Plan", date: "2023-10-26", status: "Confirmed", notes: "Approved" },
];

export const mockApi = {
    fetchAllData: async () => {
        // Simulate fetching all initial data
        // In a real app, these would be separate calls or a graphQL query
        const [students, resources, programs, announcements, appointments] = await Promise.all([
            mockFetch(initialStudents),
            mockFetch(initialResources),
            mockFetch(initialPrograms),
            mockFetch(initialAnnouncements),
            mockFetch(initialAppointments),
        ]);

        return { students, resources, programs, announcements, appointments };
    },

    // Simulate individual fetch if needed
    fetchStudents: () => mockFetch(initialStudents),
};
