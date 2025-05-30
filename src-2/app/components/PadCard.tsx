import variablesGlobal from "@/constants/variables";
import { View } from "react-native";

const PaaCard = ({...attribute}) => {
    return (
        <View style={{ width: attribute?.width || '100%', height: attribute?.height || (variablesGlobal.heigthTabBar + 20)}}></View>
    );
}

export default PaaCard;
