import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Formik } from "formik";
import { MaterialIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import userService from "../../api/userService";
import Loader from "../../components/Loader";
import CheckBox from "expo-checkbox";

function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isSelected, setSelection] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    phone: Yup.number().min(6).required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required(),
  });

  const handleOnSubmit = async (values) => {
    setLoading(true);
    try {
      var data = {
        phone: values.phone,
        email: values.email,
        password: values.password,
        type: isSelected,
      };
      var res = await userService.addUser(data);
      setLoading(false);
      if (res.statusCode == 200) {
        Alert.alert("Registration", res.message, [
          { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
        ]);
      } else {
        Alert.alert(res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error.message", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <ScrollView style={[tw`w-full`, { backgroundColor: "white" }]}>
        <View style={tw`p-8 w-full flex-1 justify-around flex-col`}>
          <Pressable
            onPress={() => navigation.navigate("LoginScreen")}
            style={tw`flex flex-row items-center mb-20 mt-2`}
          >
            <MaterialIcons name="chevron-left" size={40} color={"blue"} />
            <Text style={tw`text-2xl ml-3`}>Sign In</Text>
          </Pressable>
          <Text style={tw`text-3xl font-semibold mb-2`}>Sign Up</Text>
          {loading ? <Loader /> : null}
          <Formik
            initialValues={{
              email: "",
              password: "",
              phone: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <View style={styles.formControl}>
                  <Text style={tw`px-1 pb-1 mt-1 text-gray-300`}>Email</Text>
                  <TextInput
                    style={tw`border-b px-1 pb-2 mt-1`}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}
                </View>
                <View style={[styles.formControl]}>
                  <Text style={tw`px-1 pb-1 mt-1 text-gray-300`}>Phone</Text>
                  <TextInput
                    style={tw`border-b px-1 pb-2 mt-1`}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                    placeholder="Enter your phone number"
                    keyboardType="numeric"
                  />
                  {errors.phone && touched.phone && (
                    <Text style={styles.error}>{errors.phone}</Text>
                  )}
                </View>
                <View style={styles.formControl}>
                  <Text style={tw`px-1 pb-1 mt-1 text-gray-300`}>Password</Text>
                  <TextInput
                    style={tw`border-b px-1 pb-2 mt-1`}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder="Enter your password"
                    secureTextEntry
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>
                <View style={styles.formControl}>
                  <Text style={tw`px-1 pb-1 mt-1 text-gray-300`}>
                    Confirm Password
                  </Text>
                  <TextInput
                    style={tw`border-b px-1 pb-2 mt-1`}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}
                </View>

                <View style={styles.checkboxContainer}>
                  <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={styles.checkbox}
                  />
                  <Text style={styles.label}>Driver Account</Text>
                </View>
                <TouchableOpacity
                  style={tw`self-center bg-blue-400 p-4 rounded-xl w-full mt-5 rounded-full justify-center items-center`}
                  onPress={handleSubmit}
                >
                  <Text style={tw`text-white text-xl text-center`}>
                    Sign Up
                  </Text>
                  <View
                    style={tw`bg-white absolute w-10 h-10 justify-center items-center rounded-full right-2`}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color={"blue"}
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </Formik>
          <Text style={tw`m-5 self-center`}>Or Sign up with</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formControl: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "100",
    fontSize: 16,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});

export default RegisterScreen;
