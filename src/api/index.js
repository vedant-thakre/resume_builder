import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const getUserDetails = () => {
  return new Promise((resolve, reject) => {
    const unsubscribeAuth = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];
        const userDocRef = doc(db, "users", userData?.uid);

        const unsubscribeFirestore = onSnapshot(userDocRef, (_doc) => {
          if (_doc.exists()) {
            resolve(_doc.data());
          } else {
            setDoc(userDocRef, userData)
              .then(() => {
                resolve(userData);
              })
              .catch((error) => {
                reject(error); 
              });
          }
        }); // added few changes

        // Make sure to unsubscribe from the Firestore listener to prevent memory leaks
        return () => unsubscribeFirestore();
      } else {
        reject(new Error("User is not authenticated"));
      }

      // Make sure to unsubscribe from the Auth listener to prevent memory leaks
      unsubscribeAuth();
    });
  });
};

export const getTemplates = () => {
  new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timestamps", "asc"),
    )

    const unsubscribe = onSnapshot(templateQuery,  (querySnap) => {
      const templates = querySnap.docs.map(doc => doc.data());
      resolve(templates);
    });

    return unsubscribe;
  });
}