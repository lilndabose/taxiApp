import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  View,
} from "react-native";
import React from "react";

const Loader = ({ isLoading = true, setModalVisible }) => {
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!isLoading);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Loader;

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
});
