import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/authSlice";
import userService from "../api/userService";
import { CurrentLocation } from "../helpers/CurrentLocation";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../firebase";
import { getVariable } from "../services/AsyncStorageMethods";
import commandService from "../api/commandService";
import Loader from "./Loader";

const Visible = ({ userInfo, setVisibility , navigation}) => {
  const dispatch = useDispatch();
  const [waiting, setWaiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState(null);
  useEffect(() => {
    setInterval(async () => {
      await CurrentLocation().then(async (response) => {
        if (
          response.coords.longitude == userInfo?.position?.longitude &&
          response.coords.latitude == userInfo?.position?.latitude
        ) {
          console.log("the same");
        } else {
          // storedInformation.address = response.address[0]
          var temPosition = {
            longitude: response.coords.longitude,
            latitude: response.coords.latitude,
          };
          const data = {
            ...userInfo,
            position: temPosition,
            visibility: true,
          };

          var res = await userService.updateDevice(data);

          if (res.statusCode === 200) {
            dispatch(setUserInfo(data));
          }
        }
      });
    }, 5000);
  }, []);
  const setNotVisible = async () => {
    const data = {
      ...userInfo,
      visibility: false,
    };

    var res = await userService.updateDevice(data);

    if (res.statusCode === 200) {
      setVisibility(false);
      dispatch(setUserInfo(data));
    }
  };

  useLayoutEffect(async () => {
    const userInfo = await getVariable("userInfo");
    const collectionRef = collection(database, "commands");
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        if (
          doc?.data().driverId === userInfo.id &&
          doc?.data().status === "pending"
        ) {
          setCommand(doc.data());
        } else {
          if (
            doc?.data().driverId === userInfo.id &&
            doc?.data().status === "cancel"
          ) {
            setCommand(null);
            setWaiting(false);
          }
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const cancelCommand = async () => {
    setLoading(true);
    try {
      var datas = {
        ...command,
        status: "cancel",
      };
      var res = await commandService.updateCommand(datas);
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
  const acceptCommand = async () => {
    setLoading(true);
    try {
      var datas = {
        ...command,
        status: "accepted",
      };
      var res = await commandService.updateCommand(datas);
      setLoading(false);
      if (res.statusCode == 200) {
        navigation.navigate("TrackingScreen", { command: res.data });
      } else {
        Alert.alert(res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error.message", error.message);
    }
  };

  useEffect(() => {
    if (!!command) {
      setWaiting(true);
    }
  }, [command]);
  return (
    <View>
      {loading ? <Loader /> : null}
      {!!command ? (
        <View>
          <Modal animationType="fade" transparent={true} visible={waiting}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalContainer}>
                  <ActivityIndicator size={50} color="blue" />
                  <Text style={tw`my-2`}>
                    Price: {(command?.price).toFixed(0)} F
                  </Text>
                  <Text style={tw`my-2`}>
                    Duration: {command?.estimatedDuration} mins
                  </Text>
                  <Text style={tw`my-2`}>
                    Time to client: {command?.driverTime} mins
                  </Text>
                  <Text style={tw`my-2`}>Type: {command?.carType}</Text>
                  <View style={tw`flex flex-row justify-around`}>
                    <TouchableOpacity
                      onPress={() => acceptCommand()}
                      style={tw`mt-2 bg-green-400 p-2 rounded-md`}
                    >
                      <Text style={tw`self-center text-white`}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => cancelCommand()}
                      style={tw`mt-2 bg-red-400 p-2 rounded-md`}
                    >
                      <Text style={tw`self-center text-white`}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
      <ActivityIndicator size={150} color="blue" />
      <Text style={tw`self-center mt-20 text-2xl font-bold`}>
        Waiting for Booking
      </Text>
      <TouchableOpacity onPress={() => setNotVisible()}>
        <Text style={tw`self-center text-black`}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
export default Visible;
