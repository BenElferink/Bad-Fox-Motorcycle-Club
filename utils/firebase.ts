import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '../constants'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    appId: FIREBASE_APP_ID,
    authDomain: FIREBASE_AUTH_DOMAIN,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
  })
}

const firestore = firebase.firestore()

export { firebase, firestore }
