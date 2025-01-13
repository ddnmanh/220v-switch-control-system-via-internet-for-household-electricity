import React from "react";
import { Image, Text, View } from "react-native";
import ButtonCPN from "@/components/Button";
import { AuthContext, AuthContextProps } from "@/hooks/context/Auth.context";
import { Divider } from "react-native-paper";
import colorGlobal from "@/constants/colors";
import { ScrollView } from "react-native-gesture-handler";
import variablesGlobal from "@/constants/variables";
import imagesGlobal from "@/constants/images";

export default function Account() {

    const { userInfo, handleLogOut } = React.useContext(AuthContext) as AuthContextProps;

    return (
        <View
            style={{
                flex: 1,
            }}
        >

            <Divider style={{height: 40, backgroundColor: 'transparent'}}></Divider>

            <ScrollView style={{paddingHorizontal: variablesGlobal.marginScreenAppHorizontal}}>

                <View style={{ marginVertical: 40, flexDirection: 'column', alignItems: 'center', rowGap: 20 }}>
                    <Image
                        source={
                            userInfo?.avatar_path
                            ? { uri: userInfo?.avatar_path }
                            : imagesGlobal.UserNoAvartar
                        }

                        style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc' }}
                    />
                    <Text style={{textAlign: 'center', color: colorGlobal.textSecondary}}>{userInfo?.email}</Text>
                </View>


                <ButtonCPN
                    content="Log Out"
                    type="primary"
                    handlePress={handleLogOut}
                    disable={false}
                />


            </ScrollView>

        </View>
    );
}
