import { useFonts } from "expo-font";
import { useEffect, ReactNode } from "react";
import { SplashScreen } from "expo-router";

interface LoadStaticInitContextProviderProps {
    children: ReactNode;
}

export default function LoadStaticInitContextProvider({ children }: LoadStaticInitContextProviderProps) {
    const [fontsLoaded, error] = useFonts({
        "SanFranciscoText-Italic": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Italic.otf"),
        "SanFranciscoText-Heavy": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Heavy.otf"),
        "SanFranciscoText-HeavyItalic": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-HeavyItalic.otf"),
        "SanFranciscoText-Bold": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Bold.otf"),
        "SanFranciscoText-BoldItalic": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-BoldItalic.otf"),
        "SanFranciscoText-Light": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Light.otf"),
        "SanFranciscoText-LightItalic": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-LightItalic.otf"),
        "SanFranciscoText-Medium": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Medium.otf"),
        "SanFranciscoText-MediumItalic": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-MediumItalic.otf"),
        "SanFranciscoText-Regular": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Regular.otf"),
        "SanFranciscoText-SemiBold": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Semibold.otf"),
        "SanFranciscoText-SemiBoldItalic": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-SemiboldItalic.otf"),
        "SanFranciscoText-Thin": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-Thin.otf"),
        "SanFranciscoText-ThinItalic": require("@/assets/fonts/San-Francisco-Viet-hoa/SanFranciscoText-ThinItalic.otf"),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}
