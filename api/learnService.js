import { apiResponse } from "./client";
import { app, auth } from "../config/firebaseConfig";
import { addDoc, collection, doc, getFirestore, getDocs, query, updateDoc, where, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { randomString } from "../services/AES";
import {setVariable} from '../services/AsyncStorageMethods'

const db = getFirestore(app);

const addLearningContent = async (data) => {
    try {
        var exist = false;
        let learnData = {
            name: data.name,
            topic: data.topic
        };
        learnData.id = randomString(20)
        const querySnapshot = await getDocs(collection(db, "learns"));
            querySnapshot.forEach((doc) => {
                if (doc.data().name == learnData.name) {
                    exist = true;
                }
            });
            if (!exist) {
                await setDoc(doc(db, "learns", learnData.id ), learnData);
                return apiResponse(200, "Learn created successfully", learnData);
            }else{
                return apiResponse(422, "this name already exist", learnData)
            }
    } catch (error) {
        console.log("Error adding learn", error);
        return apiResponse(400, "Error adding learn", error)
    }
};

const listLearningTopic = async () => {
    try {
        var learns = [];
        const querySnapshot = await getDocs(collection(db, "learns"));
            querySnapshot.forEach((doc) => {
                    learns.push(doc.data())
            });
            return apiResponse(200, "Topic listed successfully", learns);

    } catch (error) {
        console.log("Cant list learns", error);
        return apiResponse(400, "Cant list learns", error)
    }
}

export default {addLearningContent, listLearningTopic};