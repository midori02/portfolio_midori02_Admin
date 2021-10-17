import {FirebaseTimestampType} from '../firebase'
import {ImageType} from './image'
import {PeriodType} from './period'

export type ContentType = {
  admin_id:string
  content_id:string
  created_at?:FirebaseTimestampType
  description:string
  genre:string
  image: ImageType[]
  period:PeriodType
  skills:string[]
  title:string
  updated_at?:FirebaseTimestampType
  url?:string
}