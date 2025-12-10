import React, { useState, useEffect } from 'react';

const quotes = [
    {
        text: "Take care of your body. It's the only place you have to live.",
        author: "Jim Rohn"
    },
    {
        text: "Health is not about the weight you lose, but the life you gain.",
        author: "Dr. Josh Axe"
    },
    {
        text: "The greatest wealth is health.",
        author: "Virgil"
    },
    {
        text: "Your body hears everything your mind says. Stay positive.",
        author: "Naomi Judd"
    },
    {
        text: "Wellness is the complete integration of body, mind, and spirit.",
        author: "Greg Anderson"
    },
    {
        text: "A healthy outside starts from the inside.",
        author: "Robert Urich"
    },
    {
        text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.",
        author: "Buddha"
    },
    {
        text: "Happiness is the highest form of health.",
        author: "Dalai Lama"
    },
    {
        text: "The mind and body are not separate. What affects one, affects the other.",
        author: "Unknown"
    },
    {
        text: "Self-care is not selfish. You cannot serve from an empty vessel.",
        author: "Eleanor Brown"
    }
];

const DailyQuote = () => {

    const [quote, setQuote] = useState(quotes[0]);

    useEffect(() => {
        // Get quote of the day based on current date
        const today = new Date().getDate();
        const quoteIndex = today % quotes.length;
        setQuote(quotes[quoteIndex]);
    }, []);

    return (
        <div className="daily-quote-card">
            <div className="quote-icon">💭</div>
            <div className="quote-content">
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">— {quote.author}</p>
            </div>
        </div>
    );
};

export default DailyQuote;
