import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PaymentModal = ({ program, user, onClose, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: user.name || ''
    });

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (cardData.number.length < 16) {
            toast.error("Invalid Card Number");
            setIsProcessing(false);
            return;
        }

        setIsProcessing(false);
        onSuccess(program.price || 19.99); // Pass amount paid
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">💎 Upgrade to Premium</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white mb-6 shadow-lg">
                    <p className="opacity-80 text-sm mb-1">Total Amount</p>
                    <h2 className="text-3xl font-bold">${program.price || "19.99"}</h2>
                    <p className="mt-4 font-mono tracking-wider">**** **** **** {cardData.number.slice(-4) || "0000"}</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Card Holder</label>
                        <input
                            type="text"
                            className="form-control w-full"
                            value={cardData.name}
                            onChange={e => setCardData({ ...cardData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Card Number</label>
                        <input
                            type="text"
                            className="form-control w-full font-mono"
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                            value={cardData.number}
                            onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, '') })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">Expiry</label>
                            <input
                                type="text"
                                className="form-control w-full"
                                placeholder="MM/YY"
                                maxLength="5"
                                value={cardData.expiry}
                                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 block mb-1">CVC</label>
                            <input
                                type="text"
                                className="form-control w-full"
                                placeholder="123"
                                maxLength="3"
                                value={cardData.cvc}
                                onChange={e => setCardData({ ...cardData, cvc: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
                                Processing...
                            </>
                        ) : (
                            `Pay $${program.price || "19.99"}`
                        )}
                    </button>
                </form>

                <p className="text-xs text-center text-gray-500 mt-4">
                    🔒 Secure 256-bit SSL Encrypted Payment
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;
