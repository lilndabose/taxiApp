import React from "react";
import { Text, View } from "react-native";
import Map from "../components/Map";
import tw from "tailwind-react-native-classnames";

function UserHomeScreen() {
    return(
        <View>
            <View style={tw`h-full`}>
                <Map />
            </View>
        </View>
    )
}

export default UserHomeScreen;