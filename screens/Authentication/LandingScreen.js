import React from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

function LandingScreen({ navigation }) {
  return (
    <View style={tw`p-10`}>
      <Text style={tw`self-center mt-20 text-2xl font-bold`}>Welcome!</Text>
      <Text style={tw`self-center mb-2 text-gray-400`}>
        You need to create an account to login
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterScreen")}
        style={tw`mt-2 bg-blue-400 p-4 rounded-md`}
      >
        <Text style={tw`self-center text-white`}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("LoginScreen")}
        style={tw`mt-4 bg-white p-4 rounded-md border border-gray-300`}
      >
        <Text style={tw`self-center text-black`}>Log In</Text>
      </TouchableOpacity>
      <Text style={tw`self-center my-2 text-gray-400`}>or</Text>
      <TouchableOpacity
        style={tw`mt-2 bg-white p-4 rounded-md border border-gray-300`}
      >
        <Text style={tw`self-center text-black`}>Log in with social</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LandingScreen;
