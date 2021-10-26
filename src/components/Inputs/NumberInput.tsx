import React , {VFC,memo} from 'react';
import {TextField} from '@mui/material'


type Props = {
  placeholder?:string
  label?:string
  variant?:"standard" | "filled" | "outlined"
  onChange:(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  value:string
  size?:"small" | "medium"
  color?:"error" | "primary" | "secondary" | "info" | "success" | "warning"
  maxNum?:number
  minNum:number
}

const NumberInput:VFC<Props> = (props) => {
  const {placeholder,label,variant,onChange,value,minNum,maxNum=99999,size='small',color='primary'} = props
  return <TextField
    InputLabelProps={{
      shrink: true,
    }}
    InputProps={{
      inputProps: {
        max: maxNum, min: minNum
      }
    }}
    type='number'
    sx={{ width:'100%',maxWidth:'280px' }}
    color={color}
    size={size}
    placeholder={placeholder}
    label={label}
    variant={variant}
    onChange={onChange}
    value={value}/>
};

export default memo(NumberInput);
