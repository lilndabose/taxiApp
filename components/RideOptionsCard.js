import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Icon } from "react-native-elements";
import { Image } from "react-native-elements/dist";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectTravelTimeInformation } from "../slices/navSlice";



const data = [
    {
        id: "Uber-X-123",
        title: "uberX",
        multiplier: 1,
        image: "https://img.icons8.com/external-xnimrodx-lineal-color-xnimrodx/64/null/external-taxi-town-xnimrodx-lineal-color-xnimrodx.png",
    },
    {
        id: "Uber-XL-456",
        title: "uber XL",
        multiplier: 1.2,
        image: "https://img.icons8.com/external-xnimrodx-lineal-color-xnimrodx/64/null/external-taxi-town-xnimrodx-lineal-color-xnimrodx.png",
    },
    {
        id: "Uber-LUX-123",
        title: "uber LUX",
        multiplier: 1.75,
        image: "https://img.icons8.com/external-xnimrodx-lineal-color-xnimrodx/64/null/external-taxi-town-xnimrodx-lineal-color-xnimrodx.png",
    },
];

const SURGE_CHARGE_RATE = 1.5;

const RideOptionsCard = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);


    return (
        <SafeAreaView style={tw`bg-white flex-grow`}>
            <View>
                <TouchableOpacity 
                onPress={() => navigation.navigate("NavigateCard")}
                style={[tw` p-3 rounded-full`, {left:0, top: 0, zIndex:1000}]}
                >
                    <Icon name="chevron-left" type="fontawesome" />
                </TouchableOpacity>
            <Text style={tw`text-center py-5 text-xl pt-5`}>Select a ride - {travelTimeInformation?.distance?.Text}</Text>
            </View>

            <FlatList 
                data={data} 
                keyExtractor={(item) => item.id}
                renderItem={({ item: { id, title, multiplier, image }, item }) => (
                    <TouchableOpacity
                    onPress={() => setSelected(item)} 
                    style={tw`flex-row justify-between items-center px-10 ${id === selected?.id && "bg-gray-200"}`}>
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                resizeMode: "contain",
                            }}
                            source={{ uri: image }}
                        />
                        <View style={tw`-ml-6`}>
                            <Text style={tw`text-xl font-semibold`}>{title}</Text>
                            <Text>{travelTimeInformation?.duration?.text} Travel Time</Text>
                        </View>
                        <Text style={tw`text-xl`}>
                            XAF
                        </Text>
                    </TouchableOpacity>
                )}

            />

            <View style={tw`mb-10 border-t border-gray-200 ml-3 mr-3`}>
                <TouchableOpacity disabled={!selected} style={tw`bg-black py-3 ${!selected && "bg-gray-300"}`}>
                    <Text style={tw`text-center text-white text-xl`}>
                        Choose {selected?.title}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default RideOptionsCard

const styles = StyleSheet.create({})