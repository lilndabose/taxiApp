import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import Loader from "../components/Loader";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { getVariable, setVariable } from "../services/AsyncStorageMethods";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import tw from "tailwind-react-native-classnames";
import { setUserInfo } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import commandService from "../api/commandService";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../firebase";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";

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

function TrackingScreen({ route, navigation }) {
  const { command } = route.params;
  console.log("command", route.params);
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [completed, setCompleted] = useState(false);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const mapref = useRef(null);

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
  const [loading, setLoading] = useState(false);

  const setAsCompleted = async () => {
    setLoading(true);
    try {
      var datas = {
        ...command,
        status: "completed",
      };
      var res = await commandService.updateCommand(datas);
      setLoading(false);
      if (res.statusCode == 200) {
        setCompleted(true);
      } else {
        Alert.alert(res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error.message", error.message);
    }
  };

  useLayoutEffect(async () => {
    const userInfo = await getVariable("userInfo");
    const collectionRef = collection(database, "commands");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let exit = false;
      snapshot.docs.map((doc) => {
        if (
          doc?.data().userId === userInfo.id ||
          doc?.data().driverId === userInfo.id
        ) {
          if (doc?.data().status === "completed") {
            setCompleted(true);
          }
          exit = true;
        }
      });

      if (!exit) {
        navigation.goBack();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <MapView
          ref={mapref}
          style={tw`h-full`}
          mapType="mutedStandard"
          initialRegion={{
            latitude: command?.startLocation?.location.lat
              ? command?.startLocation?.location.lat
              : 3.8078893,
            longitude: command?.startLocation?.location.lng
              ? command?.startLocation?.location.lng
              : 11.5560279,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {!!command?.startLocation?.location && (
            <Marker
              coordinate={{
                latitude: command?.startLocation?.location.lat,
                longitude: command?.startLocation?.location.lng,
              }}
              title="Origin"
              identifier="origin"
            >
              <Image
                source={require("../assets/pin.png")}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          )}
          {!!command?.destinationLocation?.location && (
            <Marker
              coordinate={{
                latitude: command?.destinationLocation?.location.lat,
                longitude: command?.destinationLocation?.location.lng,
              }}
              title="Destination"
              identifier="Destination"
            />
          )}
          {!!command?.destinationLocation?.description &&
            !!command?.startLocation?.description && (
              <MapViewDirections
                origin={command?.startLocation.description}
                destination={command?.destinationLocation.description}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="blue"
              />
            )}
        </MapView>
      )}

      <TouchableOpacity
        onPress={async () => {
          const userInfo = await getVariable("userInfo");
          if (userInfo.driver) {
            navigation.navigate("DriverHomeScreen");
          } else {
            navigation.navigate("UserHomeScreen");
          }
        }}
        style={styles.show}
      >
        <MaterialIcons name="chevron-left" size={30} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setVariable(null, "userInfo");
          dispatch(setUserInfo(null));
        }}
        style={styles.logout}
      >
        <MaterialIcons name="logout" size={30} />
      </TouchableOpacity>
      <View style={styles.BottomSheet}>
        {completed ? (
          <TouchableOpacity
            onPress={setAsCompleted}
            style={tw`mt-2 bg-blue-400 p-4 rounded-md`}
          >
            <Text style={tw`self-center text-white`}>Mark as completed</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={print}
          style={tw`mt-4 bg-white p-4 rounded-md border border-gray-300`}
        >
          <Text style={tw`self-center text-black`}>Print and Save Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={printToFile}
          style={tw`mt-4 bg-white p-4 rounded-md border border-gray-300`}
        >
          <Text style={tw`self-center text-black`}>Share Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logout: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    top: 40,
    borderRadius: 50,
    right: 30,
  },
  show: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    top: 40,
    borderRadius: 50,
    left: 30,
  },
  BottomSheet: {
    backgroundColor: "white",
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: "30%",
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
  },
  searchContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
  },
  currentLocation: {
    position: "absolute",
    zIndex: 1000,
    backgroundColor: "white",
    borderRadius: 50,
    width: 35,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    right: 5,
    top: 5,
  },
  backIcon: {
    position: "absolute",
    zIndex: 2000,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 50,
    width: 35,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 10,
    left: 10,
  },
  step2Container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default TrackingScreen;
