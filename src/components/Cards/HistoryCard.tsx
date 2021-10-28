import {VFC} from 'react';
import { Box , IconButton , Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BackspaceIcon from "@mui/icons-material/Backspace";

import { History } from "../../types/histories";

type Props = {
  length:number
  upRole:() => void
  downRole:() => void
  history:History
  deleteFunc:() => void
}

const HistoryCard:VFC<Props> = (props) => {
  const {history,deleteFunc,upRole,downRole,length} = props
  return (
    <Box
      margin={'auto'}
      width={'100%'}
      display={'flex'}
      justifyContent={'space-between'}
      key={history.history_id}
      sx={{":hover": {
          boxShadow: '0 5px 10px gray',
          transform: 'translate(0, -5px)'
        },
        padding:'8px 12px'
      }}
    >
      <Box>
        <Typography sx={{textAlign:'left'}}>
          {`${history.year}年${history.month}月`}
        </Typography>
        <Typography sx={{textAlign:'left'}}>
          {history.event}
        </Typography>
      </Box>
      <Box sx={{minWidth:'120px',textAlign:'end',lineHeight:4}}>
        <IconButton
          disabled={history.role === 1}
          onClick={upRole}
        >
          <ArrowUpwardIcon/>
        </IconButton>
        <IconButton
          disabled={length === 1 || history.role === length}
          onClick={downRole}>
          <ArrowDownwardIcon/>
        </IconButton>
        <IconButton onClick={deleteFunc}>
          <BackspaceIcon/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default HistoryCard;
