import {FirebaseTimestampType} from "../firebase";

export type History = {
  admin_id:string
  created_at: FirebaseTimestampType
  event:string
  history_id:string
  year:number
  month:number
  role:number
  updated_at:FirebaseTimestampType
}