import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import { firebaseConfig } from './config'

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const authPersistenceSession = firebase.auth.Auth.Persistence.SESSION
export const db = firebase.firestore()
export const storage = firebase.storage()
export const functions = firebase.functions()
export const firebaseTimeStamp = firebase.firestore.Timestamp
export type FirebaseTimestampType = firebase.firestore.Timestamp
export const adminsRef = db.collection('admin')
