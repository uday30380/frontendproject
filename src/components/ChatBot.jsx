import React, { useState, useRef, useEffect } from "react";

const ChatBot = ({ onSendMessage, messages = [], user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    // Initial Welcome Message
    const welcomeMessage = { id: 'welcome', text: "Hi there! 👋 I'm your wellness assistant. How can I help you today?", sender: "bot" };

    // Filter messages for current user
    const userMessages = user ? messages.filter(m => m.userId === user.uid) : [];

    // Merge Welcome + User History + Any Replies
    // Logic: If we have history, show history. If not, show welcome.
    // For simplicity, we just prepend welcome if list is empty? Or always show it?
    // Let's always show welcome message first for friendly UI.
    const displayMessages = [welcomeMessage, ...userMessages];

    // Optimistic UI state
    const [localMessages, setLocalMessages] = useState([]);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Merge Props + Local Optimistic Messages (deduplicating by content/time if needed, but simple concat works for now)
    // Actually, once prop comes back, it duplicates if we don't clear local.
    // Better strategy: "Pending" messages.
    // Simpler: Just rely on props? No, that caused the lag.
    // Strategy: Show local messages only if they are not in props? Hard to track.
    // Strategy: Just add to local, and when props update, we expect the backend message to exist.
    // Let's use a "pending" status.

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const optimisticMessage = {
            id: Date.now(), // Temp ID
            text: text,
            sender: "user",
            status: "sending"
        };

        // Add to local state immediately
        setLocalMessages(prev => [...prev, optimisticMessage]);
        setInput("");
        setIsTyping(true);

        try {
            if (onSendMessage) {
                await onSendMessage(text);
            }
            // Success - remove from local (assuming it will appear in props soon/immediately)
            // or keep it but mark sent? 
            // If we remove it, it might flicker if prop hasn't arrived.
            // Best: We don't remove, we just let the prop list take over?
            // Actually, usually `onSendMessage` (App.jsx) updates the state `messages` AFTER awaiting firebase.
            // So if we just fire and forget, we have a gap.

            // Let's just rely on the fact that we can append local messages that DO NOT exist in props.
        } catch (e) {
            console.error("Failed to send", e);
            // Mark as failed in local?
        }
    };

    // Combine logic: 
    // We want to show `welcomeMessage` + `userMessages` (from props) + `localMessages` (that are pending).
    // To avoid duplicates: `localMessages` should only contain items that haven't been "confirmed" by props.
    // Since this is a simple app, we can just clear `localMessages` when `messages` prop changes length? 
    // Or just clear the specific message when we detect it in props?
    // Let's try a simple approach: 
    // Show everything in `userMessages`.
    // Show `localMessages` ONLY if they are newer than the latest `userMessage`? 
    // Or just clear local messages inside the `useEffect` listening to `messages`. 

    useEffect(() => {
        // If we receive new messages from props, clear our local optimistic ones to avoid dupes/stale.
        if (messages.length > 0) {
            setLocalMessages([]);
        }
    }, [messages]);

    const displayMessages = [welcomeMessage, ...userMessages, ...localMessages];

    useEffect(() => {
        scrollToBottom();
    }, [displayMessages, isOpen, isTyping]);

    // Re-impl handleSend with clear logic


    const getBotResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes("stress") || lowerText.includes("anxious")) return "Try our '5-Minute Breathing' exercise.";
        if (lowerText.includes("book") || lowerText.includes("appointment")) return "Head to the dashboard to book a session! 📅";
        if (lowerText.includes("hello")) return "Hello! 😊 How are you?";
        return null; // No auto-reply, waiting for Admin
    };

    const quickReplies = ["I feel stressed", "Book Appointment", "Sleep tips"];

    return (
        <>
            <button
                className={`chatbot-toggle ${isOpen ? "open" : ""}`}
                onClick={toggleChat}
                aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
            >
                {isOpen ? "✕" : "💬"}
                {!isOpen && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>

            {isOpen && (
                <div className="chatbot-window fade-in-up">
                    <div className="chatbot-header">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">🤖</div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="m-0 text-lg font-bold">Wellness Assistant</h3>
                            <p className="m-0 text-xs text-secondary flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
                            </p>
                        </div>
                        <button className="bg-transparent border-none cursor-pointer opacity-50 hover:opacity-100" onClick={toggleChat} aria-label="Close">✕</button>
                    </div>

                    <div className="chatbot-messages">
                        <div className="text-center my-4 opacity-60 text-xs"><span>Today</span></div>

                        {displayMessages.map((msg, index) => (
                            <div key={msg.id || index} className={`chat-message ${msg.sender}`}>
                                {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base shrink-0">🤖</div>}
                                <div className="message-bubble">
                                    {msg.text}
                                    {msg.reply && (
                                        <div className="mt-2 pt-2 border-t border-white/20 text-sm opacity-90">
                                            <b>Admin Reply:</b> {msg.reply}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chat-message bot">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base">🤖</div>
                                <div className="message-bubble flex gap-1 items-center bg-white p-4">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 pt-0 flex gap-2 overflow-x-auto no-scrollbar">
                        {quickReplies.map(reply => (
                            <button key={reply} className="btn btn-sm btn-outline rounded-full whitespace-nowrap bg-white text-xs" onClick={() => handleSend(reply)}>
                                {reply}
                            </button>
                        ))}
                    </div>

                    <form className="chatbot-input" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary text-sm"
                        />
                        <button type="submit" disabled={!input.trim()} className={`w-11 h-11 rounded-full text-white border-none flex items-center justify-center text-lg transition-colors ${input.trim() ? 'bg-primary cursor-pointer' : 'bg-gray-300 cursor-default'}`}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBot;
