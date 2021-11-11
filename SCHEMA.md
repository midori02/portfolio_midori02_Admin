## admin (collection)
- admin_id: string
- created_at: FirebaseTimestamp
- description:string
- image
  - id:string
  - path:string
- name:string
- updated_at: FirebaseTimestamp

### histories (admin sub)
- admin_id: string
- created_at: FirebaseTimestamp
- event:string
- history_id:string
- year:number
- month:number
- role:number
- updated_at:FirebaseTimestamp

### contents (admin sub)
- admin_id: string
- content_id:string
- created_at?: FirebaseTimestamp
- description:string
- genre: string
- image:Array
  - id:string
  - path:string
- period
  - start_year:number
  - start_month:number
  - end_year?:number
  - end_month?:number
  - in_production:boolean
- skills:string[]
- title:string
- updated_at: FirebaseTimestamp
- url?:string

