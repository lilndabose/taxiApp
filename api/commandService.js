import { apiResponse } from "./client";
import {
  app,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  getDocs,
  query,
  updateDoc,
  where,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { randomString } from "../services/AES";
import { setVariable } from "../services/AsyncStorageMethods";
import { async } from "@firebase/util";

const db = getFirestore(app);

const addCommand = async (data) => {
  try {
    var exist = false;
    data.id = randomString(20);
    const querySnapshot = await getDocs(collection(db, "commands"));
    querySnapshot.forEach((doc) => {
      if (
        (doc.data().userId == data.userId &&
          (doc.data().status == "pending" ) ||
        (doc.data().driverId == data.driverId &&
          (doc.data().status == "pending" )))
      ) {
        exist = true;
      }
    });
    if (!exist) {
      await setDoc(doc(db, "commands", data.id), data);
      return apiResponse(200, "commands created successfully", data);
    } else {
      return apiResponse(422, "this commands already exist", data);
    }
  } catch (error) {
    console.log("Error adding commands", error);
    return apiResponse(400, "Error adding commands", error);
  }
};

const updateCommand = async (data) => {
  try {
    const docRef = doc(db, "commands", data.id);
    await updateDoc(docRef, data);
    return apiResponse(200, "command successfully updated", data);
  } catch (error) {
    console.log("updateUserCollection Error: ", error);
    return apiResponse(400, "Sorry there was an error updating user");
  }
};
export default { addCommand, updateCommand };
