import {FC,useState} from 'react';
import { Typography,Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import {SelectBox} from '../Inputs'
import {ContentCard} from '../Cards'
import {useSelect} from '../../lib/customHooks'
import {topPageGenreData} from '../../lib/datas'
import {ContentType} from '../../types/content'

type Props = {
  contents:ContentType[]
}

const TopTemplate:FC<Props> = (props) => {
  const {contents} = props
  const [genre,setGenre] = useState('All')
  const selectedContents = genre === 'All' ? contents : contents.filter((content) => content.genre === genre)
  return (
    <>
      <Box width={520} display={"flex"} justifyContent={"flex-start"}>
        <Typography sx={{margin:'auto'}} variant='h4'>Content List</Typography>
        <Box display={"flex"} width={240} marginTop={3} marginBottom={3}>
          <SearchIcon sx={{margin:'auto',width:32,height:32}}/>
          <SelectBox options={topPageGenreData} select={useSelect(setGenre)} value={genre}/>
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={'flex-start'} flexWrap={'wrap'}>
        {selectedContents && selectedContents.length > 0 ?
          selectedContents.map((content) => (
            <ContentCard key={content.content_id} content={content}/>
          ))
          :<Typography variant={'h6'} sx={{width:'100%',textAlign:'center'}}>Content not found...</Typography>}
      </Box>

    </>
  );
};

export default TopTemplate;
