import firebase from 'firebase/app'
import {auth,authPersistenceSession,adminsRef} from '../firebase/index'

import {admin} from '../types/admin'
import { isValidRequiredInput, isValidEmailFormat } from './validation'

const mapAdminSnapshot = (data: firebase.firestore.DocumentData): admin => ({
  created_at: data.created_at,
  description: data.description,
  email: data.email,
  image: data.image,
  name: data.name,
  admin_id: data.admin_id,
  updated_at: data.updated_at,
})

const loadAdminFromAuthUser = async (
  user: firebase.User
): Promise<admin | undefined> => {
  const snapshot = await adminsRef.doc(user.uid).get()
  const data = snapshot.data()
  if (!data) {
    console.error('Does not exist user data')
    return undefined
  }
  return mapAdminSnapshot(data)
}

/** 初回の auth クエリ用（未ログインは undefined を返す） */
export const fetchAuthUser = (): Promise<admin | undefined> => {
  const user = auth.currentUser
  if (!user) {
    return Promise.resolve(undefined)
  }
  return loadAdminFromAuthUser(user).catch((error) => {
    console.error(error)
    return undefined
  })
}

/** Firebase 認証状態の変化を react-query に反映する */
export const subscribeAuthState = (
  onChange: (adminUser: admin | undefined) => void
): (() => void) => {
  return auth.onAuthStateChanged(async (user) => {
    if (!user) {
      onChange(undefined)
      return
    }
    try {
      onChange(await loadAdminFromAuthUser(user))
    } catch (error) {
      console.error(error)
      onChange(undefined)
    }
  })
}

/** @deprecated fetchAuthUser を使用 */
export const listenAuthState = fetchAuthUser

export const logIn = ( user:{ email : string , password : string } ): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const { email, password } = user
    isValidRequiredInput(email, 'メールアドレス')
    isValidEmailFormat(email)
    isValidRequiredInput(password, 'パスワード')
    auth
      .setPersistence(authPersistenceSession)
      .then(() => {
        auth
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            resolve('Success')
          })
          .catch((error) => {
            console.log(error)
            reject(undefined)
          })
      })
      .catch((error) => {
        console.log(error)
        reject(undefined)
      })
  })
}

export const sendPasswordReset = (email: string): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    if (!isValidRequiredInput(email, 'メールアドレス')) {
      reject(undefined)
      return
    }
    if (!isValidEmailFormat(email)) {
      reject(undefined)
      return
    }
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        resolve('Success')
      })
      .catch((error) => {
        console.error(error)
        reject(error)
      })
  })
}

export const logOut = (): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    auth
      .signOut()
      .then(() => {
        resolve('Success')
      })
      .catch((error) => {
        console.error(error)
        reject(undefined)
      })
  })
}
