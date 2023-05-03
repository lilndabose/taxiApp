import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

const data = [
  {
    id: 1,
    name: "Standard",
    rate: 200,
    image: require("../assets/taxi.png"),
  },
  {
    id: 2,
    name: "VIP",
    rate: 300,
    image: require("../assets/taxi.png"),
  },
  {
    id: 3,
    name: "Van",
    rate: 400,
    image: require("../assets/taxi.png"),
  },
];

function BookRide() {
    const [active, setActive] = useState(1);
  const CarCard = ({ item }) => {
    return (
      <TouchableOpacity 
      onPress={()=> setActive(item.id)}
      style={[styles.carCardContainer, active === item.id ? {borderColor: "blue"} : null]}>
        <Image source={item.image} style={styles.image} />
        <Text style={tw`mt-2 font-bold` }>{item.name}</Text>
        <Text style={tw`mt-2 text-sm` }>200$</Text>
        <Text style={tw`bg-blue-500 px-2 py-1 mt-2 rounded-full text-white` }>3 min</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View>
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={CarCard}
        />
      </View>
      <View style={tw`my-3 flex flex-row justify-between`}>
        <View>
            <Text>Estimated Trip Time</Text>
            <Text  style={tw`text-blue-600`}>24 min</Text>
        </View>
        <View style={tw`my-3 flex flex-row justify-between items-center`}>
            <Image 
                source={require("../assets/credit-card.png")}
                style={styles.cardImage}
            />
            <Text>****8295</Text>
        </View>
      </View>
      <TouchableOpacity
        style={tw`mt-2 bg-blue-400 p-4 rounded-md`}
      >
        <Text style={tw`self-center text-white`}>Book Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  carCardContainer: {
    borderWidth: 1,
    padding: 10,
    width: 100,
    marginRight: 10,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(0,0,0,0.1)",
  },
  image: {
    width: 50,
    height: 50,
  },
  cardImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default BookRide;
