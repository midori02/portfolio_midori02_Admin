import {adminsRef,firebaseTimeStamp} from '../firebase/index'
import { isValidRequiredInput } from "./validation";
import { ImageType } from '../types/image';

export const updateAdmin = (
  id:string,
  name:string,
  description:string,
  image:ImageType[] | undefined
):Promise<string | undefined> => {
  return new Promise((resolve,reject) => {
    const cancel = () => resolve(undefined)

    if (!isValidRequiredInput(name)) {
      alert('Nameが未入力です。ご確認ください。')
      cancel()
      return
    }
    if (!isValidRequiredInput(description)) {
      alert('説明文が未入力です。ご確認ください。')
      cancel()
      return
    }
    if (!image || image.length === 0) {
      alert('画像を選択してください。')
      cancel()
      return
    }
    if (!window.confirm('この内容で更新しますか？')) {
      cancel()
      return
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