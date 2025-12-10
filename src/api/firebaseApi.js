import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    updatePassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    addDoc,
    updateDoc
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if keys are present (basic validation)
const isConfigValid = Object.values(firebaseConfig).every(value => value !== undefined && value !== "");
if (!isConfigValid) {
    console.error("⚠️ Firebase Configuration Error: Missing one or more environment variables. Check .env file.");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const firebaseApi = {
    // Auth
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Firebase Login Error:", error);
            throw error;
        }
    },

    loginWithGoogle: async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            // ADMIN PROMOTE HACK: Check for specific email
            let role = "Student";
            if (user.email === "udaykiranvempati123@gmail.com") {
                role = "Admin";
            }

            if (!userDocSnap.exists()) {
                // New User: Create records
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role: role,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString()
                });

                if (role === "Student") {
                    // Initialize Student Record
                    await setDoc(doc(db, "students", user.uid), {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        department: "General",
                        year: "1st Year",
                        wellnessScore: 100,
                        riskLevel: "Low",
                        notes: ["Registered via Google"]
                    });
                }
            } else {
                // Existing User: Check if we need to upgrade to Admin (Backfill)
                const data = userDocSnap.data();
                if (user.email === "udaykiranvempati123@gmail.com" && data.role !== "Admin") {
                    await setDoc(userDocRef, { role: "Admin" }, { merge: true });
                    role = "Admin";
                } else {
                    role = data.role || "Student";
                }
            }

            return { ...user, role }; // Return user with Role attached
        } catch (error) {
            console.error("Firebase Google Login Error:", error);
            throw error;
        }
    },

    register: async (email, password, name, role = "Student") => {
        try {
            // Safety Timeout Promise
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out. Please check your network connection.")), 15000)
            );

            // 1. Create Authentication User
            const authPromise = createUserWithEmailAndPassword(auth, email, password);
            const userCredential = await Promise.race([authPromise, timeout]);
            const user = userCredential.user;

            try {
                // 2. Update Profile Name
                await updateProfile(user, { displayName: name });

                // 3. Store in Firestore (with timeout race for safety)
                // Note: If this fails, the Auth user is still created.
                // In a production app, we might want to delete the user to rollback,
                // or just fail gracefully and let them 'complete profile' later.
                const dbPromise = (async () => {
                    await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        email: email,
                        displayName: name,
                        role: role,
                        createdAt: new Date().toISOString()
                    });

                    if (role === "Student") {
                        await setDoc(doc(db, "students", user.uid), {
                            id: user.uid,
                            name: name,
                            email: email,
                            department: "General",
                            year: "1st Year",
                            wellnessScore: 100,
                            riskLevel: "Low",
                            notes: ["Newly registered"]
                        });
                    }
                })();

                await Promise.race([dbPromise, timeout]);

            } catch (dbError) {
                console.error("Firebase Database Error (Auth succeeded):", dbError);
                // We re-throw specifically to let the UI know partial success or failure
                throw new Error("Account created, but failed to save profile data: " + dbError.message);
            }

            return {
                uid: user.uid,
                email: email,
                displayName: name,
                role: role
            };
        } catch (error) {
            console.error("Firebase Register Error:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Firebase Logout Error:", error);
            throw error;
        }
    },

    updateUserPassword: async (newPassword) => {
        try {
            const user = auth.currentUser;
            if (user) {
                await updatePassword(user, newPassword);
            } else {
                throw new Error("No user logged in");
            }
        } catch (error) {
            console.error("Firebase Password Update Error:", error);
            throw error;
        }
    },

    // Data Fetching
    fetchAllData: async () => {
        console.log("📂 [FirebaseApi] Fetching Data...");
        try {
            const [studentsSnap, resourcesSnap, programsSnap, announcementsSnap, appointmentsSnap, messagesSnap, transactionsSnap] = await Promise.all([
                getDocs(collection(db, "students")),
                getDocs(collection(db, "resources")),
                getDocs(collection(db, "programs")),
                getDocs(collection(db, "announcements")),
                getDocs(collection(db, "appointments")),
                getDocs(collection(db, "messages")),
                getDocs(collection(db, "transactions"))
            ]);

            const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const resources = resourcesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const programs = programsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const announcements = announcementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const appointments = appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const messages = messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const transactions = transactionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return {
                students,
                resources,
                programs,
                announcements,
                appointments,
                messages,
                transactions
            };
        } catch (error) {
            console.error("Firebase Data Fetch Error:", error);
            // Return empty structure on error to prevent crash
            return {
                students: [],
                resources: [],
                programs: [],
                announcements: [],
                appointments: [],
                messages: [],
                transactions: []
            };
        }
    },

    // Resources
    addResource: async (resource) => {
        const docRef = await addDoc(collection(db, "resources"), resource);
        return { ...resource, id: docRef.id };
    },
    deleteResource: async (id) => {
        await deleteDoc(doc(db, "resources", id));
    },
    updateResource: async (resource) => {
        const { id, ...data } = resource;
        await updateDoc(doc(db, "resources", id), data);
    },

    // Programs
    addProgram: async (program) => {
        const docRef = await addDoc(collection(db, "programs"), program);
        return { ...program, id: docRef.id };
    },
    deleteProgram: async (id) => {
        await deleteDoc(doc(db, "programs", id));
    },
    updateProgram: async (program) => {
        const { id, ...data } = program;
        await updateDoc(doc(db, "programs", id), data);
    },

    // Enrollment
    enrollStudentInProgram: async (studentId, programId) => {
        const studentRef = doc(db, "students", studentId);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
            const currentPrograms = studentSnap.data().enrolledPrograms || [];
            if (!currentPrograms.includes(programId)) {
                await updateDoc(studentRef, {
                    enrolledPrograms: [...currentPrograms, programId]
                });
            }
        }
    },
    leaveProgram: async (studentId, programId) => {
        const studentRef = doc(db, "students", studentId);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
            const currentPrograms = studentSnap.data().enrolledPrograms || [];
            await updateDoc(studentRef, {
                enrolledPrograms: currentPrograms.filter(id => id !== programId)
            });
        }
    },

    // Announcements
    addAnnouncement: async (announcement) => {
        const docRef = await addDoc(collection(db, "announcements"), announcement);
        return { ...announcement, id: docRef.id };
    },
    deleteAnnouncement: async (id) => {
        await deleteDoc(doc(db, "announcements", id));
    },
    updateAnnouncement: async (announcement) => {
        const { id, ...data } = announcement;
        await updateDoc(doc(db, "announcements", id), data);
    },

    // Appointments (Update Status)
    addAppointment: async (appointment) => {
        const docRef = await addDoc(collection(db, "appointments"), appointment);
        return { ...appointment, id: docRef.id };
    },
    updateAppointment: async (id, data) => {
        await updateDoc(doc(db, "appointments", id), data);
    },

    // Messaging (Support)
    sendSupportMessage: async (message) => {
        const docRef = await addDoc(collection(db, "messages"), message);
        return { ...message, id: docRef.id };
    },
    updateMessage: async (id, data) => {
        await updateDoc(doc(db, "messages", id), data);
    }
};

export { app, auth, db };
