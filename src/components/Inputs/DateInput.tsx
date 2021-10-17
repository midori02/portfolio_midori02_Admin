import React , {FC} from 'react';
import {Box,Typography} from '@mui/material';

import {NumberInput} from './index'

type Props = {
  year:string
  month:string
  minYear?:number
  maxYear?:number
  minMonth?:number
  maxMonth?:number
  setYear:(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setMonth:(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const DateInput:FC<Props> = (props) => {
  const {year,month,setYear,setMonth,minYear=2021,minMonth=1,maxYear=99999,maxMonth=12} = props
  return (
    <Box sx={{display:'flex',width:'100%'}}>
      <NumberInput minNum={minYear} maxNum={maxYear} onChange={setYear} value={year}/>
      <Typography sx={{padding:'16px'}}>年</Typography>
      <NumberInput minNum={minMonth} maxNum={maxMonth} onChange={setMonth} value={month}/>
      <Typography sx={{padding:'16px'}}>月</Typography>
    </Box>
  );
};

export default DateInput;
