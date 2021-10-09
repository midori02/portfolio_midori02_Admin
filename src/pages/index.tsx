import React,{useState,useCallback} from 'react'


import {SampleButton,PrimaryButton} from '../components/Buttons'
import {TextInput,SelectBox,CheckBox} from '../components/Inputs'
import {useStringChangeEvent,useSelect,useCheckBox} from '../lib/customHooks'

const Home = () => {
  const [name,setName] = useState('')
  const [selectText,setSelect] = useState('')
  const [check,setCheck] = useState<string[]>([])

  const checkData = ['react','nextjs','select1','react1','nextjs1','select11']
  const selectData = [{label:"test1",value:'test1'},{label:"test2",value:'test2'},{label:"test3",value:'test3'}]


  return (
    <div style={{height:"100vh"}}>
      <SampleButton />
      <div style={{width:"100%"}}>
        <TextInput multiline={true} rows={5} size={'medium'} color={'success'} placeholder={'testです'} label={'test'} value={name} onChange={useStringChangeEvent(setName)} />
        <SelectBox options={selectData} select={useSelect(setSelect)} value={selectText}/>
      </div>
      <div>
       <CheckBox state={check} values={checkData} onChange={useCheckBox(check,setCheck)}/>
      </div>

      <PrimaryButton text={'送信'} onClick={() => console.log(`name:${name},select:${selectText},check:${check}`)}/>
    </div>

  )
}

export default Home
