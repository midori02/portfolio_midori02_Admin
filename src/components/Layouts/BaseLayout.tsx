import {FC,useState,useCallback} from 'react';
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import {useMutation,useQueryClient} from 'react-query'

import {DrawerList} from '../Layouts'
import {Auth} from '../utility'
import {logOut} from '../../lib/auth'

type Props = {
  pageContents:string
  window?: () => Window
}

const BaseLayout:FC<Props> = (props) => {
  const {window,pageContents,children} = props
  const [open,setOpen] = useState(false)
  const drawerWidth = 240
  const queryClient = useQueryClient()

  const handleDrawerToggle = useCallback(() => {
    setOpen(!open);
  },[open,setOpen]);

  const logoutMutate = useMutation( logOut,{
    onSuccess:() => {
      queryClient.clear()
    }
  })

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Auth>
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor:'black'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{width:'100%'}} display={"flex"} justifyContent={'space-between'}>
            <Typography variant="h6" noWrap component="div">
              {pageContents}
            </Typography>
            <Typography sx={{cursor:'pointer'}} variant="h6" noWrap component="div" onClick={() => logoutMutate.mutate()}>
              Logout
            </Typography>
          </Box>

        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <DrawerList/>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <DrawerList/>
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <main>
          {children}
        </main>
      </Box>
    </Box>
    </Auth>
  );
};

export default BaseLayout;
