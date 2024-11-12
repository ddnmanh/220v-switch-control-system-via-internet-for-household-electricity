import MainContext from "@/hooks/context/Main.context";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <MainContext>
            <Stack>
                <Stack.Screen name="index" options={{title: 'Base'}} />
            </Stack>
        </MainContext>
    );
}
