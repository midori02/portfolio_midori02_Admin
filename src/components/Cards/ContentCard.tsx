import { VFC } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'

import { ContentType } from '../../types/content'
import { normalizeImages } from '../../lib/imageUtils'

type Props = {
  content: ContentType
}

const CARD_IMAGE_HEIGHT = 180

const ContentCard: VFC<Props> = (props) => {
  const { content } = props
  const router = useRouter()
  const imagePath = normalizeImages(content.image)?.[0]?.path
  const skillsText = (content.skills ?? []).join(' / ')

  return (
    <Box
      onClick={() => router.push(`/content/${content.content_id}`)}
      sx={{
        width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(100% / 3 - 16px)' },
        margin: '16px 8px',
        overflow: 'hidden',
        borderRadius: 1,
        ':hover': {
          boxShadow: '0 5px 10px gray',
          transform: 'translate(0, -5px)',
        },
        padding: '1px',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: CARD_IMAGE_HEIGHT,
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
        }}
      >
        {imagePath ? (
          <Image
            src={imagePath}
            alt={content.title || ''}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">No image</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ padding: '16px 8px 4px 8px' }}>
        <Typography sx={{ fontWeight: 'bold' }}>
          {content.title.length > 18 ? content.title.substr(0, 18) + '...' : content.title}
        </Typography>
        <Typography>
          {skillsText.length > 32 ? skillsText.substr(0, 32) + '...' : skillsText}
        </Typography>
        <Typography sx={{ overflow: 'hidden' }}>
          {content.description.length > 16
            ? content.description.substr(0, 16) + '...'
            : content.description}
        </Typography>
      </Box>
    </Box>
  )
}

export default ContentCard
