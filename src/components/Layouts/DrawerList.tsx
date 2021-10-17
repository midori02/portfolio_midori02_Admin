import {VFC} from 'react';
import Link from "next/link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import { Divider , List , ListItem , ListItemIcon , ListItemText , Toolbar } from "@mui/material";


const DrawerList:VFC = () => {

  const listData = [
    {name:'All Contents',icon:<ContentCopyIcon />,path:'/'},
    {name:'Add Content',icon:<AddPhotoAlternateIcon/>,path:'/content'},
    {name:'My Setting',icon:<SettingsAccessibilityIcon/>,path:'/setting'},
  ]

  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {listData.map((list) => (
          <Link key={list.name} href={list.path}>
            <a style={{textDecoration:"none",color:'black'}}>
              <ListItem button >
                <ListItemIcon>
                  {list.icon}
                </ListItemIcon>
                <ListItemText primary={list.name} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
    </div>
  );
};

export default DrawerList;
