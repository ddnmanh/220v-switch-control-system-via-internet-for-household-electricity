// contexts/MQTTContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import Paho from "paho-mqtt";
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { WifiContext } from "./Wifi.context";

// Định nghĩa kiểu cho ngữ cảnh MQTT
interface MQTTContextType {
    subscribeTopicMQTT: (topic: string) => void;
    publishToTopicMQTT: (topic: string, message: string) => void;
    setOnMessageArrivedFromMQTT: (callback: (message: Paho.Message) => void) => void;
    removeOnMessageArrivedFromMQTT: (callback: (message: Paho.Message) => void) => void;
    handleConnectMQTT: () => void;
    handleDisconnectMQTT: () => void;
    isMQTTConnected: boolean;
}

// Tạo ngữ cảnh với giá trị mặc định là `undefined`
const MQTTContext = createContext<MQTTContextType | undefined>(undefined);

// Props cho MQTTContextProvider
interface MQTTContextProviderProps {
    children: ReactNode;
}

export const MQTTContextProvider: React.FC<MQTTContextProviderProps> = ({ children }) => {

    const {isWifiConnected} = useContext(WifiContext) || {isWifiConnected: false};

    const clientRef = useRef<Paho.Client | null>(null);
    const messageCallbacks = useRef<Array<(message: Paho.Message) => void>>([]);
    const [isMQTTConnected, setIsMQTTConnected] = useState<boolean>(false);

    React.useEffect(() => {
        if (isWifiConnected) {
            handleConnectMQTT();
        } else {
            handleDisconnectMQTT();
        }
    }, [isWifiConnected])


    const handleConnectMQTT = () => {

        console.log("Connecting to MQTT Broker...");


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
                setIsMQTTConnected(true);
            },
            onFailure: (err: any) => {
                console.log("MQTT Connection failed", err);
            },
            userName: process.env.EXPO_PUBLIC_MQTT_BROKER_USERNAME as string || 'app',
            password: process.env.EXPO_PUBLIC_MQTT_BROKER_PASSWORD as string || '123',
        });

        client.onConnectionLost = (response: any) => {
            console.log("MQTT Connection lost", response.errorMessage);
            setIsMQTTConnected(false);
        };

        client.onMessageArrived = (message: any) => {
            console.log("MQTT Message Received:", message.payloadString);
            messageCallbacks.current.forEach((cb) => cb(message));
        };
    }

    const subscribeTopicMQTT = (topic: string) => {
        if (clientRef.current && isMQTTConnected) {
            try {
                clientRef.current.subscribe(topic, { qos: 0 });
                console.log(`Subscribed to topic: ${topic}`);
            } catch (error) {
                console.log("Error subscribing to topic:", error);
                console.log(error);
            }
        } else {
            console.log("Client is not ready or not connected.");
        }
    };

    const publishToTopicMQTT = (topic: string, message: string) => {
        if (clientRef.current && isMQTTConnected) {
            const msg = new Paho.Message(message);
            msg.destinationName = topic;
            clientRef.current.send(msg);
            console.log(`Published message to topic: ${topic}`, message);
        } else {
            console.log("Client not connected. Please wait...");
        }
    };

    const setOnMessageArrivedFromMQTT = (callback: (message: Paho.Message) => void) => {
        if (callback) {
            messageCallbacks.current.push(callback);
        }
    };

    const removeOnMessageArrivedFromMQTT = (callback: (message: Paho.Message) => void) => {
        messageCallbacks.current = messageCallbacks.current.filter((cb) => cb !== callback);
    };

    const handleDisconnectMQTT = () => {
        if (clientRef.current && clientRef.current.isConnected()) {
            clientRef.current.disconnect();
        }
    }

    return (
        <MQTTContext.Provider
            value={{
                subscribeTopicMQTT,
                publishToTopicMQTT,
                setOnMessageArrivedFromMQTT,
                removeOnMessageArrivedFromMQTT,
                handleConnectMQTT,
                handleDisconnectMQTT,
                isMQTTConnected
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
