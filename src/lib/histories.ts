import {adminsRef,firebaseTimeStamp} from '../firebase/index'
import { isValidRequiredInput } from "./validation";

import {History} from '../types/histories'

export const fetchHistories = (adminId:string):Promise<History[] | undefined> => {
  return new Promise((resolve,reject) => {
    adminsRef
      .doc(adminId)
      .collection('histories')
      .orderBy('role','asc')
      .get()
      .then((snapshots) => {
        const historiesData = []
        snapshots.forEach((snapshot) => {
          const data = snapshot.data()
          historiesData.push(data)
        })
        resolve(historiesData)
      })
      .catch((error) => {
        console.error (error)
        reject(undefined)
      })
  })
}

export const createHistory = (history:{
  admin_id:string,
  event:string,
  year:number,
  month:number,
  role:number
}):Promise<string | undefined> => {
  return new Promise((resolve,reject) => {
    const {event,admin_id,year,month,role} = history
    if (!isValidRequiredInput(event)) {
      alert('内容が未入力です。ご確認ください。')
      reject(undefined)
      return false
    }
    if (!window.confirm('この内容で作成しますか？')) {
      reject(undefined)
      return false
    }
    const history_id = adminsRef.doc(admin_id).collection('histories').doc().id
    const historyData = {
      admin_id:admin_id,
      created_at : firebaseTimeStamp.now(),
      event:event,
      history_id:history_id,
      year:year,
      month:month,
      role:role,
      updated_at:firebaseTimeStamp.now()
    }
    adminsRef
      .doc(admin_id)
      .collection('histories')
      .doc(history_id)
      .set(historyData)
      .then(() => {
        resolve('created history')
      })
      .catch((error) => {
        console.error (error)
        reject(undefined)
      })
  })
}

export const removeHistory = (
  adminId: string,
  id: string,
  currentLength: number,
  deleteNumber: number
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    if (!window.confirm('本当に削除しますか？')) {
      reject(undefined)
      return false
    }
    adminsRef
      .doc(adminId)
      .collection('histories')
      .doc(id)
      .delete()
      .then(() => {
        if (deleteNumber === currentLength) {
          resolve('deleted')
        } else {
          adminsRef
            .doc(adminId)
            .collection('histories')
            .where('role', '>', deleteNumber)
            .get()
            .then((snapshots) => {
              snapshots.forEach((snapshot) => {
                const data = snapshot.data()
                adminsRef
                  .doc(adminId)
                  .collection('histories')
                  .doc(data.history_id)
                  .set({ role: data.role - 1 }, { merge: true })
                  .then(() => {
                    resolve('delete')
                  })
                  .catch((err) => {
                    console.error(err)
                    reject(undefined)
                  })
              })
            })
        }
      })
      .catch((error) => {
        console.error(error)
        reject(undefined)
      })
  })
}

export const updateHistoryRole = (
  adminId: string,
  historyId: string,
  update: number,
  currentNum: number
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    adminsRef
      .doc(adminId)
      .collection('histories')
      .where('role', '==', update)
      .get()
      .then((snapshots) => {
        const orderRole = []
        snapshots.forEach((snapshot) => {
          const data = snapshot.data()
          orderRole.push(data)
        })
        const changeRoleId = orderRole[0].history_id
        adminsRef
          .doc(adminId)
          .collection('histories')
          .doc(changeRoleId)
          .set({ role: currentNum }, { merge: true })
          .then(() => {
            adminsRef
              .doc(adminId)
              .collection('histories')
              .doc(historyId)
              .set({ role: update }, { merge: true })
              .then(() => {
                resolve('updated role')
              })
              .catch((error) => {
                console.error(error)
                reject(undefined)
              })
          })
      })
      .catch((error) => {
        console.error(error)
        reject(undefined)
      })
  })
}