// contexts/MQTTContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import Paho from "paho-mqtt";

// Định nghĩa kiểu cho ngữ cảnh MQTT
interface MQTTContextType {
    subscribe: (topic: string) => void;
    publish: (topic: string, message: string) => void;
    setOnMessageArrived: (callback: (message: Paho.Message) => void) => void;
    removeOnMessageArrived: (callback: (message: Paho.Message) => void) => void;
    connected: boolean;
}

// Tạo ngữ cảnh với giá trị mặc định là `undefined`
const MQTTContext = createContext<MQTTContextType | undefined>(undefined);

// Props cho MQTTContextProvider
interface MQTTContextProviderProps {
    children: ReactNode;
}

export const MQTTContextProvider: React.FC<MQTTContextProviderProps> = ({ children }) => {
    const clientRef = useRef<Paho.Client | null>(null);
    const messageCallbacks = useRef<Array<(message: Paho.Message) => void>>([]);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        const client = new Paho.Client(
            process.env.EXPO_PUBLIC_MQTT_BROKER_HOST as string || '192.168.1.4',
            Number(process.env.EXPO_PUBLIC_MQTT_BROKER_PORT) || 8083,
            process.env.EXPO_PUBLIC_MQTT_PATH as string || '/mqtt',
            "app-"+Date.now() // Temporary
        );
        clientRef.current = client;

        client.connect({
            onSuccess: () => {
                console.log("MQTT Broker connected");
                setConnected(true);
            },
            onFailure: (err: any) => {
                console.error("MQTT Connection failed", err);
            },
            userName: process.env.EXPO_PUBLIC_MQTT_BROKER_USERNAME as string || 'app',
            password: process.env.EXPO_PUBLIC_MQTT_BROKER_PASSWORD as string || '123',
        });

        client.onConnectionLost = (response: any) => {
            console.error("MQTT Connection lost", response.errorMessage);
            setConnected(false);
        };

        client.onMessageArrived = (message: any) => {
            console.log("MQTT Message Received:", message.payloadString);
            messageCallbacks.current.forEach((cb) => cb(message));
        };

        return () => {
            if (clientRef.current && clientRef.current.isConnected()) {
                clientRef.current.disconnect();
            }
        };
    }, []);

    const subscribe = (topic: string) => {
        if (clientRef.current && connected) {
            clientRef.current.subscribe(topic, { qos: 0 });
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error("Client is not ready or not connected.");
        }
    };

    const publish = (topic: string, message: string) => {
        if (clientRef.current && connected) {
            const msg = new Paho.Message(message);
            msg.destinationName = topic;
            clientRef.current.send(msg);
            console.log(`Published message to topic: ${topic}`, message);
        } else {
            console.error("Client not connected. Please wait...");
        }
    };

    const setOnMessageArrived = (callback: (message: Paho.Message) => void) => {
        if (callback) {
            messageCallbacks.current.push(callback);
        }
    };

    const removeOnMessageArrived = (callback: (message: Paho.Message) => void) => {
        messageCallbacks.current = messageCallbacks.current.filter((cb) => cb !== callback);
    };

    return (
        <MQTTContext.Provider
            value={{
                subscribe,
                publish,
                setOnMessageArrived,
                removeOnMessageArrived,
                connected,
            }}
        >
            {children}
        </MQTTContext.Provider>
    );
};

export const MQTTContextConsumer = MQTTContext.Consumer;

export const useMQTTContext = (): MQTTContextType => {
    const context = useContext(MQTTContext);
    if (!context) {
        throw new Error("useMQTTContext must be used within an MQTTContextProvider");
    }
    return context;
};
