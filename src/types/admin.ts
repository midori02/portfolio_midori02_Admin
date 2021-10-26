import {FirebaseTimestampType} from '../firebase'

export type admin = {
  admin_id:string
  created_at: FirebaseTimestampType
  description:string
  email:string
  image: [
    {id:string,path:string}
  ]
  name:string
  updated_at:FirebaseTimestampType
}