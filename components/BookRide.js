import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import Loader from "./Loader";
import { getVariable } from "../services/AsyncStorageMethods";
import commandService from "../api/commandService";

import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../firebase";

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

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Receipt</title>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      h1, h2, h3 {
        margin: 0;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      td, th {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .total {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Receipt</h1>
    <p>Date: May 3, 2023</p>
    <table>
      <tr>
        <th>Item</th>
        <th>Price</th>
      </tr>
      <tr>
        <td>T-shirt</td>
        <td>$20.00</td>
      </tr>
      <tr>
        <td>Hoodie</td>
        <td>$40.00</td>
      </tr>
      <tr>
        <td class="total">Total</td>
        <td class="total">$60.00</td>
      </tr>
    </table>
  </body>
</html>
`;

function BookRide({ drivers, startLocation, destinationLocation, navigation }) {
  const [active, setActive] = useState(1);

  const [selectedPrinter, setSelectedPrinter] = useState();
  const [closeDriver, setCloseDriver] = useState(null);
  const [closeDistance, setCloseDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [driverDistance, setDriverDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [exchange, setExchange] = useState(null);
  const [command, setCommand] = useState(null);
  //   const [currentDistance, setCurrentDistance] = useState(100000000);
  const tripDistance = getDistanceFromLatLonInKm(
    destinationLocation.location.lat,
    destinationLocation.location.lng,
    startLocation.location.lat,
    startLocation.location.lng
  );

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };
  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    console.log("File has been saved to:", uri);
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  useEffect(() => {
    const d = closeDistance ? closeDistance : 0;
    setPrice(exchange * d);
  }, [exchange]);

  useLayoutEffect(async () => {
    const userInfo = await getVariable("userInfo");
    const collectionRef = collection(database, "commands");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let exit = false;
      snapshot.docs.map((doc) => {
        if (doc?.data().userId === userInfo.id) {
          if (doc?.data().status === "accepted") {
            navigation.navigate("TrackingScreen", { command: doc?.data() });
          }
          exit = true;
        }
      });

      if (!exit) {
        setCommand(null);
        setWaiting(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const bookDriver = () => {
    let newDriver = null;
    let currentDistance = 100000000;
    drivers.map((driver) => {
      const distance = getDistanceFromLatLonInKm(
        driver.position.latitude,
        driver.position.longitude,
        startLocation.location.lat,
        startLocation.location.lng
      );

      if (currentDistance > distance) {
        currentDistance = distance;
        newDriver = driver;
      }
    });
    if (newDriver) {
      setCloseDriver(newDriver);
      setCloseDistance(currentDistance);
      setEstimatedTime(((tripDistance / 40) * 60).toFixed(0));
      setDriverDistance(((currentDistance / 40) * 60).toFixed(0));
    } else {
      Alert.alert("No driver found");
    }
  };

  const CarCard = ({ item, setExchange, distance }) => {
    const d = item.item.rate * distance;
    return (
      <TouchableOpacity
        onPress={() => {
          setActive(item.item.id);
          setExchange(item.item.rate);
        }}
        style={[
          styles.carCardContainer,
          active === item.item.id ? { borderColor: "blue" } : null,
        ]}
      >
        <Image source={item.item.image} style={styles.image} />
        <Text style={tw`mt-2 font-bold`}>{item.name}</Text>
        <Text style={tw`bg-blue-500 px-2 py-1 mt-2 rounded-full text-white`}>
          {d.toFixed(0)} F
        </Text>
      </TouchableOpacity>
    );
  };

  const connectToDriver = async () => {
    const userInfo = await getVariable("userInfo");

    setLoading(true);
    try {
      var datas = {
        destinationLocation: destinationLocation,
        startLocation: startLocation,
        userId: userInfo.id,
        driverId: closeDriver.id,
        status: "pending",
        carType: data[active].name,
        estimatedDuration: estimatedTime,
        driverTime: driverDistance,
        price: tripDistance * data[active].rate,
      };
      var res = await commandService.addCommand(datas);
      setLoading(false);
      if (res.statusCode == 200) {
        setCommand(res.data);
        setWaiting(true);
      } else {
        Alert.alert(res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error.message", error.message);
    }
  };

  const cancelCommand = async () => {
    setLoading(true);
    try {
      var datas = {
        ...command,
        status: "cancel",
      };
      var res = await commandService.deleteCommand(datas);
      setLoading(false);
      if (res.statusCode == 200) {
        setCommand(null);
        setWaiting(false);
      } else {
        Alert.alert(res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error.message", error.message);
    }
  };

  return (
    <View>
      {/* <Button title="Print" onPress={print} />
      <Button title="Print to PDF file" onPress={printToFile} /> */}
      {loading ? <Loader /> : null}
      <View>
        <Modal animationType="fade" transparent={true} visible={waiting}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalContainer}>
                <ActivityIndicator size={50} color="blue" />
                <Text style={tw`my-5 text-2xl text-center`}>
                  Waiting For Driver Response
                </Text>
                <TouchableOpacity
                  onPress={() => cancelCommand()}
                  style={tw`mt-2 bg-red-400 p-4 rounded-md`}
                >
                  <Text style={tw`self-center text-white`}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <CarCard
              key={item.id}
              item={item}
              setExchange={setExchange}
              distance={tripDistance ? tripDistance : 0}
            />
          )}
        />
      </View>
      <View style={tw`my-6 flex flex-row justify-between`}>
        <View>
          <Text>Estimated Trip Time</Text>
          {driverDistance ? (
            <Text style={tw`text-blue-600`}>{driverDistance} mins</Text>
          ) : (
            <Text style={tw`text-red-600`}>no time estimated</Text>
          )}
        </View>
        <View>
          <Text>Driver time</Text>
          {estimatedTime ? (
            <Text style={tw`text-blue-600`}>{estimatedTime} mins</Text>
          ) : (
            <Text style={tw`text-red-600`}>no price</Text>
          )}
        </View>
        <View style={tw`my-3 flex flex-row justify-between items-center`}>
          <Image
            source={require("../assets/credit-card.png")}
            style={styles.cardImage}
          />
          <Text>****8295</Text>
        </View>
      </View>
      <View style={tw`my-3 flex flex-row justify-between items-center`}>
        <TouchableOpacity
          onPress={() => bookDriver()}
          style={tw`mt-2 bg-blue-400 p-4 rounded-md`}
        >
          <Text style={tw`self-center text-white`}>Search Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => connectToDriver()}
          style={tw`mt-2 bg-white p-4 border rounded-md`}
        >
          <Text style={tw`self-center text-black`}>Connect To Driver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carCardContainer: {
    borderWidth: 1,
    padding: 10,
    width: 120,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    opacity: 0.8,
    backgroundColor: "black",
    borderRadius: 15,
    height: Dimensions.get("window").height * 2,
    width: Dimensions.get("window").width,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    backgroundColor: "white",
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 20,
  },
});

export default BookRide;
