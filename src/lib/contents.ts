import {adminsRef,firebaseTimeStamp} from '../firebase/index'
import {isValidRequiredInput} from './validation'
import {ImageType} from '../types/image'
import {ContentType} from '../types/content'


export const fetchContents = (id:string):Promise<ContentType[] | undefined> => {
  return new Promise((resolve,reject) => {
    adminsRef
      .doc(id)
      .collection('contents')
      .get()
      .then((snapshots) => {
        const contentData = []
        snapshots.forEach((snapshot) => {
          const data = snapshot.data()
          contentData.push(data)
        })
        resolve(contentData)
      })
      .catch((error) => {
        console.error (error)
        reject(undefined)
      })
  })
}

export const fetchContent = (uid:string,contentId:string):Promise<ContentType | undefined> => {
  return new Promise((resolve,reject) => {
    adminsRef
      .doc(uid)
      .collection('contents')
      .doc(contentId)
      .get()
      .then((document) => {
        const data = document.data() as ContentType
        resolve(data)
      })
      .catch((error) => {
        console.error (error)
        reject(undefined)
      })
  })
}

export const deleteContent = (uid:string,contentId:string):Promise<string | undefined> => {
  return new Promise((resolve,reject) => {
    if (!window.confirm('本当に削除しますか？')) {
      resolve(undefined)
      return
    }
    adminsRef
      .doc(uid)
      .collection('contents')
      .doc(contentId)
      .delete()
      .then(() => {
        resolve('deleted contents')
      })
      .catch((err) => {
        console.error (err)
        reject(undefined)
      })
  })
}

export const createContent = (
  contentId:string,
  adminId:string,
  image:ImageType[],
  title:string,
  description:string,
  genre:string,
  skills:string[],
  startYear:number,
  startMonth:number,
  endYear:number,
  endMonth:number,
  inProduction:boolean,
  url:string
):Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const cancel = () => resolve(undefined)

    if (!image || image.length === 0) {
      alert('画像を選択して下さい。')
      cancel()
      return
    }
    if (!isValidRequiredInput(title)) {
      alert('タイトルが未入力です。ご確認ください。')
      cancel()
      return
    }
    if (!isValidRequiredInput(description)) {
      alert('説明が未入力です。ご確認ください。')
      cancel()
      return
    }
    if (!isValidRequiredInput(genre)) {
      alert('ジャンルを指定して下さい。')
      cancel()
      return
    }
    if (!skills || skills.length === 0) {
      alert('スキルが選択されていません。')
      cancel()
      return
    }
    const confirmMessage = contentId
      ? 'この内容で更新しますか？'
      : 'この内容で作成しますか？'
    if (!window.confirm(confirmMessage)) {
      cancel()
      return
    }
    let contentData = {}
    if(!contentId) {
      contentId = adminsRef.doc(adminId).collection('contents').doc().id
      contentData = {
        admin_id:adminId,
        content_id:contentId,
        created_at:firebaseTimeStamp.now(),
        description:description,
        genre:genre,
        image:image,
        period:{
          start_year:startYear,
          start_month:startMonth,
          end_year:endYear,
          end_month:endMonth,
          in_production:inProduction
        },
        skills:skills,
        title:title,
        updated_at:firebaseTimeStamp.now(),
        url:url
      }
    } else {
      contentData = {
        admin_id:adminId,
        content_id:contentId,
        description:description,
        genre:genre,
        image:image,
        period:{
          start_year:startYear,
          start_month:startMonth,
          end_year:endYear,
          end_month:endMonth,
          in_production:inProduction
        },
        skills:skills,
        title:title,
        updated_at:firebaseTimeStamp.now(),
        url:url
      }
    }

    adminsRef
      .doc(adminId)
      .collection('contents')
      .doc(contentId)
      .set(contentData,{merge:true})
      .then(() => {
        resolve('create content!!')
      })
      .catch((error) => {
        console.error (error)
        reject(undefined)
      })
  })
}