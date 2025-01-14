
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject, getStorage } from 'firebase/storage';
import { getDoc,addDoc, updateDoc, deleteDoc, collection, doc , where, query, writeBatch, getDocs} from "firebase/firestore";
import { database } from "../firebase"; 


export const updateMainRecord = async (mainCollection, mainId, data) => {
    try {
      await updateDoc(doc(database, mainCollection, mainId), data);
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e;
    }
  };


  export const fetchMainRecord = async (collectionName, userId) => {
    try {
      const userDocRef = doc(database, collectionName, userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data(); // Return the user record
      } else {
        console.error("No such user record found!");
        return null;
      }
    } catch (e) {
      console.error("Error fetching user record: ", e);
      throw e;
    }
  };
  