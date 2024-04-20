/// <reference types="web-bluetooth" />

'use client'
import React, { useState } from 'react';

interface Device {
    id: string;
    name: string;
}

const Scan: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [error, setError] = useState<string>('');

    const handleScan = async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service'] // Specify services if known
            });

            // Check if the device is already in the list to avoid duplicates
            const isExistingDevice = devices.some(d => d.id === device.id);
            if (!isExistingDevice) {
                const newDevice = {
                    id: device.id,
                    name: device.name || 'Unknown Device'
                };
                setDevices([...devices, newDevice]);
            }
        } catch (err) {
            // Assuming err is of type Error
            if (err instanceof Error) {
                setError(`Error: ${err.message}`);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div>
            <button onClick={handleScan}>Scan for Devices</button>
            {error && <p>{error}</p>}
            <ul>
                {devices.map(device => (
                    <li key={device.id}>{device.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Scan;
