import {VFC,memo} from 'react';
import { Select, MenuItem,FormControl,OutlinedInput,InputLabel } from '@mui/material'

type Props = {
  text?: string
  size?:"medium" | "small"
  options: { label: string; value: string }[]
  select: (value: unknown) => void
  value: string
  variant?: 'filled' | 'outlined' | 'standard'
  isRequired?: boolean
  labelText?: string
  labelColor?: 'primary' | 'secondary' | 'default'
}

const SelectBox:VFC<Props> = memo((props) => {
  const {
    text,
    options,
    select,
    value,
    variant = 'outlined',
    size= 'small'
  } = props
  return (
    <FormControl sx={{mt:1,width:'100%'}}>
      <InputLabel id={`select-box-label-${text}`}>{text}</InputLabel>
      <Select
        size={size}
        labelId={`select-box-label-${text}`}
        id={`select-box-${text}`}
        label={text}
        value={value}
        onChange={(e) => select(e.target.value)}
        variant={variant}
        sx={{width:'100%'}}
        input={<OutlinedInput id={`select-box-${text}`} label={text} />}
      >
        {options.map((option) => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default SelectBox;
