import React from 'react';
import { app } from '../api/firebaseApi';


const FirebaseTest = () => {
    let configStatus = "Unknown";
    let configDetails = {};

    try {
        // Access internal property _options or options to see what config was passed
        // Note: private properties might change, but usually 'options' exists
        configDetails = app.options || "No options found";
        configStatus = "Initialized";
    } catch (e) {
        configStatus = "Error: " + e.message;
    }

    return (
        <div style={{ padding: 20, background: '#333', color: '#fff', position: 'fixed', bottom: 0, left: 0, zIndex: 9999, width: '100%', fontSize: '12px', fontFamily: 'monospace' }}>
            <h3>🔥 Firebase Connection Test</h3>
            <p><strong>Status:</strong> {configStatus}</p>
            <pre>{JSON.stringify(configDetails, null, 2)}</pre>
        </div>
    );
};

export default FirebaseTest;
