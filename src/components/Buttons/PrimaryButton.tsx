import {VFC} from 'react';
import {Button} from '@mui/material'

type Props = {
  text:string
  color?:"inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
  variant?:"text" | "outlined" | "contained"
  onClick:() =>void
  size?:"small" | "medium" | "large"
  disabled?:boolean
}

const PrimaryButton:VFC<Props> = (props) => {
  const {text,color='primary',variant='outlined',onClick,size='medium',disabled=false} = props
  return <Button
    sx={{width:'100%',borderRadius:'16px'}}
    color={color} variant={variant}
    onClick={onClick}
    size={size}
    disabled={disabled}
  >
    {text}
  </Button>
};

export default PrimaryButton;
