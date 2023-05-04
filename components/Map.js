import React, { useLayoutEffect, useState } from "react";
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
import { useRef } from "react";
import { useEffect } from "react";
import { CurrentLocation } from "../helpers/CurrentLocation";
import Loader from "./Loader";
import userService from "../api/userService";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import SearchLocation from "./SearchLoaction";
import BookRide from "./BookRide";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { setVariable } from "../services/AsyncStorageMethods";

import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../firebase";
import { setUserInfo } from "../slices/authSlice";

const Map = ({ navigation }) => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const mapref = useRef(null);
  const dispatch = useDispatch();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(true);

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

  useLayoutEffect(() => {
    const collectionRef = collection(database, "users");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDrivers(
        snapshot.docs.reduce((prev, next) => {
          if (next?.data()?.visibility === true) {
            return [...prev, next.data()];
          } else {
            return prev;
          }
        }, [])
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getAllDrivers();
    CurrentLocation().then((response) => {
      var temPosition = {
        lng: response.coords.longitude,
        lat: response.coords.latitude,
      };
      setStartLocation({ location: temPosition });
    });
  }, []);

  useEffect(() => {
    console.log("startLocation", startLocation);
  }, [startLocation]);
  useEffect(() => {
    console.log("destinationLocation", destinationLocation);
  }, [destinationLocation]);

  return (
    <View style={tw`flex-1`}>
      {!!!startLocation || loading ? (
        <Loader />
      ) : (
        <MapView
          ref={mapref}
          style={tw`flex-1`}
          mapType="mutedStandard"
          region={{
            latitude: startLocation?.location.lat,
            longitude: startLocation?.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {!!startLocation?.location && (
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
            )}

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
{/* 
        <TouchableOpacity onPress={() => setShow(!show)} style={styles.show}>
          {!show ? (
            <MaterialIcons name="location-pin" size={30} />
          ) : (
            <MaterialIcons name="close" size={30} />
          )}
        </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => {
          setVariable(null, "userInfo");

          dispatch(setUserInfo(null));
        }}
        style={styles.logout}
      >
        <MaterialIcons name="logout" size={30} />
      </TouchableOpacity>
      {show ? (
        <>
          <View style={styles.BottomSheet}>
            {step === 1 ? (
              <ScrollView keyboardShouldPersistTaps="always">
                <View>
                  <TouchableOpacity
                    disabled={!!!startLocation}
                    onPress={() => setStep(step + 1)}
                    style={styles.currentLocation}
                  >
                    <MaterialIcons name="chevron-right" size={25} />
                  </TouchableOpacity>
                  <SearchLocation
                    setLocation={setStartLocation}
                    placeholder="Type your address here"
                  />
                </View>
              </ScrollView>
            ) : null}
            {step === 2 ? (
              <ScrollView keyboardShouldPersistTaps="always">
                <View>
                  <TouchableOpacity
                    disabled={!!!destinationLocation}
                    onPress={() => setStep(step + 1)}
                    style={styles.currentLocation}
                  >
                    <MaterialIcons name="chevron-right" size={25} />
                  </TouchableOpacity>
                  <SearchLocation
                    setLocation={setDestinationLocation}
                    placeholder="Type Your destination"
                  />
                </View>
              </ScrollView>
            ) : null}
            {step === 3 ? (
              <BookRide
                drivers={drivers}
                startLocation={startLocation}
                destinationLocation={destinationLocation}
                navigation={navigation}
              />
            ) : null}
            {step > 1 ? (
              <TouchableOpacity
                onPress={() => setStep(step - 1)}
                style={styles.backIcon}
              >
                <MaterialIcons name="chevron-left" size={25} />
              </TouchableOpacity>
            ) : null}
          </View>
        </>
      ) : null}
    </View>
  );
};

export default Map;

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
    height: "50%",
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
