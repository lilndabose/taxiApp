import React, { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import {
  selectDestination,
  selectOrigin,
  selectTravelTimeInformation,
  setOrigin,
} from "../slices/navSlice";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useRef } from "react";
import { useEffect } from "react";
import { CurrentLocation } from "../helpers/CurrentLocation";
import Loader from "./Loader";
import userService from "../api/userService";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapref = useRef(null);
  const dispatch = useDispatch();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState([]);

  const getAllDrivers = () => {
    setLoading(true);
    userService
      .getDrivers()
      .then((response) => {
        setDrivers(response.data);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllDrivers();
    CurrentLocation().then((response) => {
      var temPosition = {
        lng: response.coords.longitude,
        lat: response.coords.latitude,
      };
      dispatch(setOrigin({ location: temPosition }));
    });
  }, []);

  useEffect(() => {
    console.log(!!origin?.location);
  }, [origin]);

  //   useEffect(() => {
  //     if (!origin || !destination) return;

  //     //Zomm & fit to markers
  //     mapref.current.fitToSuppliedMarkers(["origin", "destination"], {
  //       edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //     });
  //   }, [origin, destination]);

  //   useEffect(() => {
  //     // if (!origin || !destination) return;

  //     const getTravelTime = async () => {
  //       fetch(
  //         "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}"
  //       )
  //         .then((res) => res.json())
  //         .then((data) => {
  //           dispatch(selectTravelTimeInformation(data.rows[0].elements[0]));
  //         });
  //     };
  //     getTravelTime();
  //   }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  return (
    <View style={tw`flex-1`}>
      {!!!origin?.location || loading ? (
        <Loader />
      ) : (
        <MapView
          ref={mapref}
          style={tw`flex-1`}
          mapType="mutedStandard"
          initialRegion={{
            latitude: origin?.location.lat,
            longitude: origin?.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {origin?.location && (
            <Marker
              coordinate={{
                latitude: origin?.location.lat,
                longitude: origin?.location.lng,
              }}
              title="Origin"
              description={origin.description}
              identifier="origin"
            >
              <Image
                source={require("../assets/pin.png")}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          )}
          {drivers.map((item) => (
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
          ))}
          {/* {origin && destination && (
        <MapViewDirections
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="black"
        />
      )}


      {destination?.location && (
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
      <View style={styles.BottomSheet}>
        {/* <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={30} color={"gray"} />
        </View> */}
        <ScrollView>
          <GooglePlacesAutocomplete
            placeholder="Type your address here"
            styles={styles.searchContainer}
            onPress={(data, details = null) => {
              //   dispatch(
              //     setOrigin({
              //       location: details.geometry.location,
              //       description: data.description,
              //     })
              //   );
              //   dispatch(setDestination(null));
              console.log("data", data);
            }}
            fetchDetails={true}
            returnKeyType={"search"}
            enablePoweredByContainer={false}
            minLength={2}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  BottomSheet: {
    backgroundColor: "white",
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: "33%",
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
  },
  searchContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 50,
    borderWidth: 1
  },
});
