import React, { useState, useRef, useEffect } from "react";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 I'm your wellness assistant. How can I help you today?", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(input);
            setMessages((prev) => [...prev, { id: Date.now() + 1, text: botResponse, sender: "bot" }]);
        }, 1000);
    };

    const getBotResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes("stress") || lowerText.includes("anxious") || lowerText.includes("worry")) {
            return "I'm sorry to hear you're feeling that way. 🧘‍♀️ Try our '5-Minute Breathing' exercise in the Wellness section. Deep breathing can help calm your nervous system.";
        } else if (lowerText.includes("sleep") || lowerText.includes("tired") || lowerText.includes("insomnia")) {
            return "Sleep is crucial! 😴 Try to maintain a consistent sleep schedule and avoid screens 30 minutes before bed. Have you checked out our 'Sleep Mastery' program?";
        } else if (lowerText.includes("diet") || lowerText.includes("food") || lowerText.includes("eat") || lowerText.includes("nutrition")) {
            return "Fueling your body is important! 🍎 Focus on whole foods and staying hydrated. Our 'Nutrition Basics' guide has some great meal prep ideas.";
        } else if (lowerText.includes("support") || lowerText.includes("help") || lowerText.includes("counselor")) {
            return "We're here for you. 🤝 You can book a session with a counselor through the 'Support' page or the 'Book' button on your dashboard.";
        } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
            return "Hello! 😊 How are you feeling today?";
        } else {
            return "That's interesting! 🤔 I'm still learning, but I recommend exploring the 'Health Resources' tab for more articles and guides.";
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={`chatbot-toggle ${isOpen ? "open" : ""}`}
                onClick={toggleChat}
                aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
            >
                {isOpen ? "✕" : "💬"}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window fade-in-up">
                    <div className="chatbot-header">
                        <h3>Wellness Assistant 🤖</h3>
                        <button className="btn-icon" onClick={toggleChat} aria-label="Close">
                            ✕
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-message ${msg.sender}`}>
                                <div className="message-bubble">{msg.text}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            aria-label="Chat message input"
                        />
                        <button type="submit" className="btn btn-primary btn-sm" aria-label="Send message">
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBot;
