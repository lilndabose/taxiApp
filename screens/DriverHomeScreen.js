import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";


import { MaterialIcons } from "@expo/vector-icons";
import { CurrentLocation } from "../helpers/CurrentLocation";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../slices/authSlice";
import { setUserInfo } from "../slices/authSlice";
import { async } from "@firebase/util";
import userService from "../api/userService";
import Visible from "../components/Visible";
import { setVariable } from "../services/AsyncStorageMethods";

function DriverHomeScreen({navigation}) {
  const [visibility, setVisibility] = useState(false);
  const userInfo = useSelector(selectAuthUser);
  

  return (
    <View style={tw`bg-white w-full h-full p-8`}>
      <View style={tw`my-5 flex flex-row justify-between`}>
        <MaterialIcons name="menu" size={30} color={"black"} />
        <MaterialIcons name="logout" size={30} color={"black"} onPress={() => setVariable(null, "userInfo")} />
      </View>
      <View style={tw`w-full h-full items-center justify-center`}>
        {!visibility ? (
          <TouchableOpacity
            onPress={() => setVisibility(!visibility)}
            style={tw`mt-2 bg-blue-400 p-4 rounded-md`}
          >
            <Text style={tw`self-center text-white`}>Click to be visible</Text>
          </TouchableOpacity>
        ) : (
          <Visible userInfo={userInfo} setVisibility={setVisibility} navigation={navigation} />
        )}
      </View>
    </View>
  );
}

export default DriverHomeScreen;
