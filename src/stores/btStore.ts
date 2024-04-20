// btStore.js
import create from "zustand";

const useStore = create((set) => ({
  devices: [],
  error: null,
  dataCallback: null, // Add this to store the callback function

  addDevice: (device) =>
    set((state) => ({ devices: [...state.devices, device] })),
  updateDeviceData: (id, data) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === id ? { ...device, data } : device
      ),
    })),
  setError: (error) => set({ error }),
  setDataCallback: (callback) => set({ dataCallback: callback }), // Add method to set the callback
}));

export default useStore;
