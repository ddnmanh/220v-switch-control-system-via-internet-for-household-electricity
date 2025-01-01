import React from "react";
import { Text, View } from "react-native";
import ButtonCPN from "@/components/Button";
import { AuthContext } from "@/hooks/context/Auth.context";

export default function Account() {

    const { handleLogOut } = React.useContext(AuthContext) || { handleLogOut: () => {} };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Account screen</Text>
            <ButtonCPN
                content="Log Out"
                type="primary"
                handlePress={handleLogOut}
                disable={false}
            />
        </View>
    );
}
