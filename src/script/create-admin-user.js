// This script should be run once to create the admin user
// You can run it with Node.js: node create-admin-user.js

import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import bcrypt from "bcryptjs"

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBtxdEUgH1PKDwniJy1vh_nVjI6YWsFOvw",
  authDomain: "admin-dashboard-995f8.firebaseapp.com",
  projectId: "admin-dashboard-995f8",
  storageBucket: "admin-dashboard-995f8.firebasestorage.app",
  messagingSenderId: "1091748651648",
  appId: "1:1091748651648:web:470703d3f6fc9277bd3c65",
  measurementId: "G-PXCGJLD3P5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)

// Admin user details - CHANGE THESE VALUES
const ADMIN_EMAIL = "admin4545@openshop.com"
const ADMIN_PASSWORD = "#Lcbisho4545"
const ADMIN_FIRST_NAME = "Super"
const ADMIN_LAST_NAME = "Admin"

async function createAdminUser() {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
    const user = userCredential.user

    // Hash the password for storage
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, salt)

    // Create admin user document
    await setDoc(doc(firestore, "admin", user.uid), {
      role: "admin",
      email: ADMIN_EMAIL,
      fname: ADMIN_FIRST_NAME,
      lname: ADMIN_LAST_NAME,
      uid: user.uid,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    })

    console.log("Admin user created successfully:", user.uid)
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

createAdminUser()

