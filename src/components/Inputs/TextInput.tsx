import React , {VFC,memo} from 'react';
import {TextField} from '@mui/material'


type Props = {
  placeholder?:string
  label?:string
  variant?:"standard" | "filled" | "outlined"
  multiline?:boolean
  rows?:number
  onChange:(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  value:string
  size?:"small" | "medium"
  color?:"error" | "primary" | "secondary" | "info" | "success" | "warning"
}

const TextInput:VFC<Props> = memo( (props) => {
  const {placeholder,label,variant,multiline=false,rows=1,onChange,value,size='small',color='primary'} = props
  return <TextField
    sx={{ width:'100%' }}
    rows={rows}
    color={color}
    size={size}
    placeholder={placeholder}
    label={label}
    variant={variant}
    multiline={multiline}
    onChange={onChange}
    value={value}/>
});

export default TextInput;
