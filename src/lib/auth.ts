import firebase from 'firebase/app'
import {auth,authPersistenceSession,adminsRef} from '../firebase/index'

import { admin } from '../types/admin'
import { normalizeImages } from './imageUtils'
import { isValidRequiredInput, isValidEmailFormat } from './validation'

const mapAdminSnapshot = (data: firebase.firestore.DocumentData): admin => ({
  created_at: data.created_at,
  description: data.description,
  email: data.email,
  image: (normalizeImages(data.image) ?? []) as admin['image'],
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
    console.error('Does not exist user data for uid:', user.uid)
    return undefined
  }
  return mapAdminSnapshot({
    ...data,
    admin_id: data.admin_id ?? user.uid,
  })
}

/** 初回の auth クエリ用（Firebase 認証の初期化完了を待つ） */
export const fetchAuthUser = (): Promise<admin | undefined> => {
  const resolveAdmin = async (user: firebase.User | null): Promise<admin | undefined> => {
    if (!user) return undefined
    try {
      return await loadAdminFromAuthUser(user)
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  return new Promise((resolve) => {
    let settled = false
    const finish = (value: admin | undefined) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    const current = auth.currentUser
    if (current) {
      resolveAdmin(current).then(finish)
      return
    }

    const timeout = setTimeout(() => {
      console.warn('fetchAuthUser: auth state timeout, treating as logged out')
      finish(undefined)
    }, 10000)

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe()
      clearTimeout(timeout)
      finish(await resolveAdmin(user))
    })
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

export const sendPasswordReset = (email: string): Promise<string> => {
  const trimmed = email.trim()
  if (trimmed === '') {
    return Promise.reject(new Error('メールアドレスが未入力です。'))
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (!emailRegex.test(trimmed)) {
    return Promise.reject(new Error('メールアドレスの形式が不正です。'))
  }
  return auth
    .sendPasswordResetEmail(trimmed)
    .then(() => 'Success')
    .catch((error: firebase.auth.Error) => {
      console.error(error)
      const message =
        error.code === 'auth/user-not-found'
          ? '登録されていないメールアドレスです。'
          : '再設定メールの送信に失敗しました。しばらくしてからお試しください。'
      return Promise.reject(new Error(message))
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
