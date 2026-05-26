import {VFC} from 'react';
import { Box , IconButton , Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BackspaceIcon from "@mui/icons-material/Backspace";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

import { History } from "../../types/histories";

type Props = {
  length:number
  upRole:() => void
  downRole:() => void
  history:History
  deleteFunc:() => void
  dragHandleAttributes?: DraggableAttributes
  dragHandleListeners?: SyntheticListenerMap
}

const HistoryCard:VFC<Props> = (props) => {
  const {history,deleteFunc,upRole,downRole,length,dragHandleAttributes,dragHandleListeners} = props
  return (
    <Box
      margin={'auto'}
      width={'100%'}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{
        ':hover': {
          boxShadow: '0 5px 10px gray',
          transform: 'translate(0, -5px)',
        },
        padding:'8px 12px',
        backgroundColor: '#fff',
        borderRadius: 1,
      }}
    >
      <Box display="flex" alignItems="flex-start" gap={0.5} flex={1} minWidth={0}>
        {dragHandleAttributes && dragHandleListeners && (
          <Box
            component="button"
            type="button"
            aria-label="ドラッグして並び替え"
            sx={{
              border: 'none',
              background: 'none',
              p: 0.5,
              mt: 0.5,
              cursor: 'grab',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 1,
              '&:active': { cursor: 'grabbing' },
            }}
            {...dragHandleAttributes}
            {...dragHandleListeners}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>
        )}
        <Box minWidth={0}>
          <Typography sx={{textAlign:'left'}}>
            {`${history.year}年${history.month}月`}
          </Typography>
          <Typography sx={{textAlign:'left'}}>
            {history.event}
          </Typography>
        </Box>
      </Box>
      <Box sx={{minWidth:'120px',textAlign:'end',flexShrink:0}}>
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
