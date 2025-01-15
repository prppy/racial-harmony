
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject, getStorage } from 'firebase/storage';
import { getDoc, addDoc, updateDoc, deleteDoc, collection, doc , where, query, writeBatch, getDocs} from "firebase/firestore";
import { database } from "../firebase"; 


const storage = getStorage();

export const uploadImage = async (file, userId, collectionName) => {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file. Please provide a valid File object.");
  }

  const uuid = crypto.randomUUID(); // Generate a unique identifier
  const storageRef = ref(storage, `${userId}/${collectionName}/${uuid}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadURL, imageRef: storageRef.fullPath });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};


{/* MAIN COLLECTION */}
// Function to create a MAIN record in Firestore
export const createMainRecord = async (mainCollection, data) => {
  try {
    const docRef = await addDoc(collection(database, mainCollection), data);
    await updateDoc(docRef, { id: docRef.id });
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Function to update MAIN document 
export const updateMainRecord = async (mainCollection, mainId, data) => {
  try {
    await updateDoc(doc(database, mainCollection, mainId), data);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Function to delete MAIN document 
export const deleteMainRecord = async (mainCollection, mainId) => {
  try {
    await deleteDoc(doc(database, mainCollection, mainId));
  } catch (error) {
    console.error("Error deleting main document:", error);
    throw error;
  }
};

  export const fetchMainCollection = async (collectionName) => {
    try {
      // collecting all items
      const querySnapshot = await getDocs(collection(database, collectionName));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data
    }
    catch(error) {
      console.log("Error fetching trade " )
      return null
    }
  }
  
  export const fetchMainRecord = async (mainCollection, id) => {
    try {
      // collecting item
      const docRef = doc(database, mainCollection, id);
      const docSnap = await getDoc(docRef);
      return docSnap.data()
    }
    catch(error) {
      console.log("Error fetching "+ +mainCollection+ id + error)
      return null
    }
  }


{/* SUBCOLLECTION */}
// Function to save SUBCOLLECTION record in Firestore
export const saveRecord = async (mainCollection, mainId, collectionName, data) => {
  try {
    const docRef = await addDoc(collection(database, mainCollection, mainId, collectionName), data);
    await updateDoc(docRef, { id: docRef.id });
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Function to update SUBCOLLECTION recordin Firestore
export const updateRecord = async (mainCollection, mainId, collectionName, docId, data) => {
  try {
    await updateDoc(doc(database, mainCollection, mainId, collectionName, docId), data);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Function to delete SUBCOLLECTION record in Firestore
export const deleteRecord = async (mainCollection, mainId, collectionName, docId) => {
  try {
    await deleteDoc(doc(database, mainCollection, mainId, collectionName, docId));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const fetchCollection = async (mainCollection, mainId, subCollection) => {
  try {
    // collecting all items
    const querySnapshot = await getDocs(collection(database, mainCollection, mainId, subCollection));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data
  }
  catch(error) {
    console.log("Error fetching " + subCollection)
    return null
  }
}

export const fetchRecord = async (mainCollection, mainId, collectionName, id) => {
  try {
    // collecting item
    const docRef = doc(database, mainCollection, mainId, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }
  catch(error) {
    console.log("Error fetching " + mainCollection + collectionName + id + error)
    return null
  }
}


{/* STORAGE DELETION */}
async function deleteStorageFolderContents(folderRef) {
  try {
    const listResult = await listAll(folderRef);
  
    // Delete all the files
    const deletePromises = listResult.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);

    // Delete all the subfolders
    const folderDeletePromises = listResult.prefixes.map(deleteStorageFolderContents);
    await Promise.all(folderDeletePromises);
  } catch (error) {
    console.error("Error deleting folder contents:", error);
    throw error;
  }
}

async function deleteStorageUserFolder(userId) {
  const userFolderRef = ref(storage, userId);
  await deleteStorageFolderContents(userFolderRef);
  console.log(`User folder ${userId} deleted successfully.`);
}


  