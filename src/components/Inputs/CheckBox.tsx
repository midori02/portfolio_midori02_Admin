import React,{VFC,memo} from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'

type Props = {
  state: string[]
  values: string[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}


const CheckBox:VFC<Props> =memo( (props) => {
  const {  values, state, onChange } = props
  return (
    <FormGroup row>
      {values &&
      values.map((value) => (
        <FormControlLabel
          key={value}
          control={<Checkbox onChange={onChange} checked={state.includes(value)} name={value} />}
          label={value}
        />
      ))}
    </FormGroup>
  );
});

export default CheckBox;
