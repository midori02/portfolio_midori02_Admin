import { VFC } from 'react'
import { useRouter } from 'next/router'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'

type Props = {
  onNavigate?: () => void
}

const DrawerList: VFC<Props> = ({ onNavigate }) => {
  const router = useRouter()

  const listData = [
    { name: 'All Contents', icon: <ContentCopyIcon />, path: '/' },
    { name: 'Add Content', icon: <AddPhotoAlternateIcon />, path: '/content' },
    { name: 'My Setting', icon: <SettingsAccessibilityIcon />, path: '/setting' },
  ]

  const isSelected = (path: string) => {
    if (path === '/') return router.pathname === '/'
    return router.pathname === path || router.pathname.startsWith(`${path}/`)
  }

  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {listData.map((list) => (
          <ListItem
            key={list.name}
            button
            selected={isSelected(list.path)}
            onClick={() => {
              onNavigate?.()
              if (!isSelected(list.path)) {
                router.push(list.path)
              }
            }}
            sx={{ color: 'black', cursor: 'pointer' }}
          >
            <ListItemIcon>{list.icon}</ListItemIcon>
            <ListItemText primary={list.name} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default DrawerList
