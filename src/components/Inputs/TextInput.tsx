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
  type?:string
  margin?:"none" | "dense" | "normal"
}

const TextInput:VFC<Props> =  (props) => {
  const {
    placeholder,
    label,
    variant,
    multiline=false,
    rows=1,
    onChange,
    value,
    size='small',
    color='primary',
    type='text',
    margin='none'
  } = props
  return <TextField
    margin={margin}
    sx={{ width:'100%' }}
    rows={rows}
    color={color}
    size={size}
    placeholder={placeholder}
    label={label}
    variant={variant}
    type={type}
    multiline={multiline}
    onChange={onChange}
    value={value}/>

};

export default memo(TextInput);
