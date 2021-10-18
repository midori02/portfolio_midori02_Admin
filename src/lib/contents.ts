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
  return new Promise((resolve,reject) => {
    if(image === undefined) {
      alert('画像を選択して下さい。')
      reject(undefined)
      return false
    }
    if (!isValidRequiredInput(title)) {
      alert('タイトルが未入力です。ご確認ください。')
      reject(undefined)
      return false
    }
    if (!isValidRequiredInput(description)) {
      alert('説明が未入力です。ご確認ください。')
      reject(undefined)
      return false
    }
    if (!isValidRequiredInput(genre)) {
      alert('ジャンルを指定して下さい。')
      reject(undefined)
      return false
    }
    if(skills.length === 0) {
      alert('スキルが選択されていません。')
      reject(undefined)
      return false
    }
    if (!window.confirm('この内容で作成しますか？')) {
      reject(undefined)
      return false
    }
    let contentData = {}
    if(!contentId) {
      contentId = adminsRef.doc(adminId).collection('contents').doc().id
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
    } else {
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