import {auth,authPersistenceSession,adminsRef} from '../firebase/index'

import {admin} from '../types/admin'
import { isValidRequiredInput, isValidEmailFormat, isValidMinLength } from './validation'

export const listenAuthState = (): Promise<admin | undefined> => {
  return new Promise((resolve, reject) => {
    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        reject(undefined)
      } else {
        return adminsRef
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data()
            if (!data) {
              console.error('Does not exist user data')
              reject(undefined)
            } else {
              resolve({
                created_at: data.created_at,
                description:data.description,
                email:data.email,
                image:data.image,
                name: data.name,
                admin_id: data.admin_id,
                updated_at: data.updated_at,
              })
            }
          })
          .catch((error) => {
            console.error(error)
            reject(undefined)
          })
      }
    })
  })
}

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

