
import { createContext, useEffect, useState, useContext } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { auth, database } from "../firebase";
import {doc, getDoc, setDoc, collection} from "firebase/firestore"
import {fetchMainRecord} from "../utils/firebaseUtils"

export const AuthContext = createContext();

export const AuthContextProvider = ({children})  => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    // checking whether user is logged in
    useEffect(() => {

        // onAuthStateChanged
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRecord = await fetchMainRecord('users', user.uid) 
                setIsAuthenticated(true)
                setUser({ ...userRecord, bg: userRecord.bg || 0})
                updateUserData(user.uid)
                updateUserBackground(userRecord.bg || 0)
            } else {
                setIsAuthenticated(false)
                setUser(null)
            }

        })
        return unsub
    },  [])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await fetchMainRecord('users', user.userId);
        updateUserBackground(userDetails.bg || 0);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
  
    if (user) {
      fetchData();
    }
  }, [user]);

    const updateUserBackground = (bgIndex) => {
        if (user) {
        setUser((prev) => ({ ...prev, bg: bgIndex }));
            document.body.style.backgroundImage = `url(/bg${bgIndex}.png)`;
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundRepeat= "no-repeat";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
          
            
        }
    }
    

    // creating the reference for the current User, so that in other screens, we can use {user} as a reference to the user
    const updateUserData = async (userId) => {
        const docRef = doc(database, "users", userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            let data = docSnap.data()
            setUser({...user, name: data.name, userId: data.userId, admin:data.admin})
        }

    }
    // login function
    const login = async (email, password, admin) => {
        try {

            const response = await signInWithEmailAndPassword(auth, email, password)
            const docRef = doc(database, "users", response.user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
          
                if (userData.admin === admin) {
                  setUser({ ...response.user, ...userData });
                  setIsAuthenticated(true);
                  return { success: true };
                } else {
                  await signOut(auth); 
                  return { success: false, msg: "Please select the correct role." };
                }
              } else {
                return { success: false, msg: "User data not found. Please contact support." };
              }
            

        } catch(e) {
            let msg = e.message
            if (msg.includes('(auth/invalid-email)')) {
                msg='Invalid email'
            }
            if (msg.includes('(auth/invalid-credential)')) {
                msg='Wrong credentials'
            }
            return {success:false, msg}
        }
    }
    // logout function
    const logout = async () => {
        try {

            await signOut(auth)
            setUser(null); 
            setIsAuthenticated(false);
            return {success:true}

        } catch(e) {
            return {success: false, msg: e.message, error:e}
            
        }
    }
    // register function
    const register = async (email, password, name, admin) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            console.log("response.user: ", response?.user)

            await setDoc(doc(database, "users", response?.user?.uid), {
                name,
                email,
                userId: response?.user?.uid,
                admin: admin,
                voucher_balance:0,
                bg:0
            } )
            return {success:true, data: response?.user}

            
        } catch(e) {
            let msg = e.message
            if (msg.includes('(auth/invalid-email)')) {
                msg='Invalid email'
            }
            if (msg.includes('(auth/email-already-in-use)')) {
                msg = "This email is already in use"
            }
            return {success:false, msg}
            
        }
    }

    return (
        <AuthContext.Provider value = {{user, isAuthenticated, login, register, logout, updateUserBackground}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const value = useContext(AuthContext)

    if (!value) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider')
    }

    return value
}

