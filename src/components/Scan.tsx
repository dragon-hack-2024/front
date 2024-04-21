// Scan.js
import { Typography, Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import {
  HomeIcon
} from "lucide-react";

const Scan = ({ onDataReceived }) => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "ESP32" }],
        optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"],
      });

      console.log("Connecting to", device.name);
      const server = await device.gatt.connect();
      console.log("Connected to GATT Server");
      const service = await server.getPrimaryService(
        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
      );
      const characteristic = await service.getCharacteristic(
        "beb5483e-36e1-4688-b7f5-ea07361b26a8"
      );

      characteristic.oncharacteristicvaluechanged = (event) => {
        const value = event.target.value;
        const intValue = value.getUint16(0, true); // Read value as a 16-bit unsigned integer
        onDataReceived(intValue);
        updateDeviceData(device.id, intValue);
      };

      await characteristic.startNotifications();

      const newDevice = {
        id: device.id,
        name: device.name || "Unknown Device",
        data: "Waiting for data...",
      };

      setDevices((prevDevices) => {
        const isExistingDevice = prevDevices.some((d) => d.id === device.id);
        return isExistingDevice ? prevDevices : [...prevDevices, newDevice];
      });
    } catch (err) {
      setError(`Error: ${err.message || "An unknown error occurred"}`);
    }
  };

  const updateDeviceData = (id, data) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, data: `Data: ${data}` } : device
      )
    );
  };

  return (
    <Box
    sx={{
      mt: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Typography variant="subtitle1">workout</Typography> 
      <Typography onClick={handleScan} variant="h3" sx={{ display: "inline", mr: 2 }}>
        Jump Rope Hero
      </Typography>
    </Box>
    <IconButton href="/" aria-label="notifications">
      <HomeIcon size={22}/>
    </IconButton>
  </Box>
  );
};

export default Scan;
