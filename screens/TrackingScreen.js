import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import Loader from "../components/Loader";
import MapView from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { setVariable } from "../services/AsyncStorageMethods";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import tw from "tailwind-react-native-classnames";

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

function TrackingScreen({ route }) {
//   const { command } = route.params;
//   console.log("command", route.params);
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [show, setShow] = useState(false)
  
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

  return (
    <View>
        {false ? (
          <Loader />
        ) : (
          <MapView
            ref={mapref}
            style={tw`h-full`}
            mapType="mutedStandard"
            initialRegion={{
              //   latitude: command.startLocation?.location.lat,
              latitude: 3.8078893,
              //   longitude: command.startLocation?.location.lng,
              longitude: 11.5560279,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            {/* {!!startLocation?.location && (
              <Marker
                coordinate={{
                  latitude: startLocation?.location.lat,
                  longitude: startLocation?.location.lng,
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
            {!!destinationLocation?.location && (
              <Marker
                coordinate={{
                  latitude: destinationLocation?.location.lat,
                  longitude: destinationLocation?.location.lng,
                }}
                title="Destination"
                identifier="Destination"
              />
            )}
            {drivers.map((item) => {
              return (
                <Marker
                  coordinate={{
                    latitude: item?.position.latitude,
                    longitude: item?.position.longitude,
                  }}
                  title="driver"
                  description={item.description}
                  identifier={item.id}
                >
                  <Image
                    source={require("../assets/taxi.png")}
                    style={{ width: 40, height: 40 }}
                  />
                </Marker>
              );
            })}
            {!!destinationLocation?.description &&
              !!startLocation?.description && (
                <MapViewDirections
                  origin={startLocation.description}
                  destination={destinationLocation.description}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={3}
                  strokeColor="blue"
                />
              )} */}

            {/* {destination?.location && (
                <Marker
                  coordinate={{
                    latitude: destination.location.lat,
                    longitude: destination.location.lng,
                  }}
                  title="Origin"
                  description={destination.description}
                  identifier="destination"
                />
              )} */}
          </MapView>
        )}

        <TouchableOpacity onPress={() => setShow(!show)} style={styles.show}>
          {show ? (
            <MaterialIcons name="location-pin" size={30} />
          ) : (
            <MaterialIcons name="close" size={30} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setVariable(null, "userInfo")}
          style={styles.logout}
        >
          <MaterialIcons name="logout" size={30} />
        </TouchableOpacity>
        {!show ? (
          <>
            <View style={styles.BottomSheet}>
              <Button title="Print" onPress={print} />
              <Button title="Print to PDF file" onPress={printToFile} />
            </View>
          </>
        ) : null}
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
    height: "40%",
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
