import {adminsRef,firebaseTimeStamp} from '../firebase/index'
import { isValidRequiredInput } from "./validation";

export const updateAdmin = (
  id:string,
  name:string,
  description:string,
  image:[{path:string,id:string}]
):Promise<string | undefined> => {
  return new Promise((resolve,reject) => {
    if (!isValidRequiredInput(name)) {
      alert('Nameが未入力です。ご確認ください。')
      reject(undefined)
      return false
    }
    if (!isValidRequiredInput(description)) {
      alert('説明文が未入力です。ご確認ください。')
      reject(undefined)
      return false
    }
    if (!window.confirm('この内容で作成しますか？')) {
      reject(undefined)
      return false
    }
    const userData = {
      admin_id:id,
      description:description,
      image:image,
      name:name,
      updated_at:firebaseTimeStamp.now()
    }
    adminsRef
      .doc(id)
      .set(userData,{merge:true})
      .then(() => {
        resolve('updated admin')
      })
      .catch((error) => {
        console.error (error)
        reject(undefined)
      })
  })
}