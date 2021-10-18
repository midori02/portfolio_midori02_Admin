import {VFC} from 'react';
import Image from "next/image";
import { Box , Typography } from "@mui/material";

import {ContentType} from '../../types/content'

type Props = {
  content:ContentType
}

const ContentCard:VFC<Props> = (props) => {
  const {content} = props
  return (
    <Box key={content.content_id} sx={{
      width:'calc(100% / 3 - 16px)',
      margin:'16px 8px',
      ":hover": {
        boxShadow: '0 5px 10px gray',
        transform: 'translate(0, -5px)'
      },
      padding:'1px',
      cursor:'pointer'
    }}>
      <Image src={content.image[0].path} width={500} height={300} objectFit={'cover'}/>
      <Box sx={{padding:'16px 8px 4px 8px'}}>
        <Typography>
          {content.title.length > 18
            ? content.title.substr(0,18) + '...'
            : content.title}
        </Typography>
        <Typography>
          {content.skills.join(' / ').length > 32
            ? content.skills.join(' / ').substr(0,32) + '...'
            :content.skills.join(' / ')}
        </Typography>
        <Typography sx={{overflow:'hidden'}}>
          {content.description.length > 16
            ? content.description.substr(0,16) + '...'
            : content.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default ContentCard;
