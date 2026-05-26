import { FC, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, Typography, Divider, Alert } from '@mui/material'
import { useQueryClient } from 'react-query'

import { ImageUploader } from '../image'
import { TextInput, SelectBox, CheckBox, DateInput, PrimarySwitch } from '../Inputs'
import { PrimaryButton } from '../Buttons'
import { useStringChangeEvent, useSelect, useCheckBox } from '../../lib/customHooks'
import { createContent, deleteContent } from '../../lib/contents'
import { genreData, skillData } from '../../lib/datas'
import { ContentType } from '../../types/content'
import { normalizeImages } from '../../lib/imageUtils'
import { ImageType } from '../../types/image'

type Props = {
  content?: ContentType
  uid: string
}

const ContentTemplate: FC<Props> = (props) => {
  const { content, uid } = props
  const router = useRouter()
  const queryClient = useQueryClient()
  const isEdit = !!content?.content_id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [genre, setGenre] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [startYear, setStartYear] = useState('2021')
  const [startMonth, setStartMonth] = useState('1')
  const [endYear, setEndYear] = useState('2021')
  const [endMonth, setEndMonth] = useState('1')
  const [inProduction, setInProduction] = useState(false)
  const [image, setImage] = useState<ImageType[] | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onTitleChange = useStringChangeEvent(setTitle)
  const onDescriptionChange = useStringChangeEvent(setDescription)
  const onUrlChange = useStringChangeEvent(setUrl)
  const onStartYearChange = useStringChangeEvent(setStartYear)
  const onStartMonthChange = useStringChangeEvent(setStartMonth)
  const onEndYearChange = useStringChangeEvent(setEndYear)
  const onEndMonthChange = useStringChangeEvent(setEndMonth)

  useEffect(() => {
    if (!content) return
    setTitle(content.title)
    setDescription(content.description)
    setUrl(content.url ?? '')
    setGenre(content.genre)
    setSkills(content.skills ?? [])
    setStartYear(String(content.period.start_year))
    setStartMonth(String(content.period.start_month))
    setEndMonth(String(content.period.end_month))
    setEndYear(String(content.period.end_year))
    setInProduction(content.period.in_production)
    setImage(normalizeImages(content.image))
  }, [content])

  const handleSave = useCallback(async () => {
    setErrorMessage(null)
    setIsSaving(true)
    try {
      const result = await createContent(
        content?.content_id ?? '',
        uid,
        image,
        title,
        description,
        genre,
        skills,
        Number(startYear),
        Number(startMonth),
        Number(endYear),
        Number(endMonth),
        inProduction,
        url
      )
      if (!result) return
      await queryClient.invalidateQueries('contents')
      if (content?.content_id) {
        await queryClient.invalidateQueries(['content', content.content_id])
      }
      router.push('/')
    } catch {
      setErrorMessage('保存に失敗しました。入力内容を確認してください。')
    } finally {
      setIsSaving(false)
    }
  }, [
    content?.content_id,
    uid,
    image,
    title,
    description,
    genre,
    skills,
    startYear,
    startMonth,
    endYear,
    endMonth,
    inProduction,
    url,
    queryClient,
    router,
  ])

  const handleDelete = useCallback(async () => {
    if (!content?.content_id) return
    setErrorMessage(null)
    setIsDeleting(true)
    try {
      const result = await deleteContent(uid, content.content_id)
      if (!result) return
      await queryClient.invalidateQueries('contents')
      router.push('/')
    } catch {
      setErrorMessage('削除に失敗しました。')
    } finally {
      setIsDeleting(false)
    }
  }, [content?.content_id, uid, queryClient, router])

  return (
    <>
      <Typography variant="h5">{isEdit ? 'Edit Content' : 'Create Content'}</Typography>
      <Box sx={{ display: 'flex', margin: '32px 0', paddingLeft: '20px' }}>
        <Typography sx={{ width: '240px' }} variant="body1">
          Image
        </Typography>
        <ImageUploader
          image={image}
          setImage={setImage}
          imageName={'content'}
          width={480}
          height={270}
          fit="contain"
        />
      </Box>
      <Box sx={{ display: 'flex', margin: '32px 0', paddingLeft: '20px' }}>
        <Typography sx={{ width: '240px' }} variant="body1">
          Title
        </Typography>
        <TextInput label={'title'} onChange={onTitleChange} value={title} />
      </Box>
      <Box sx={{ display: 'flex', margin: '32px 0', paddingLeft: '20px' }}>
        <Typography sx={{ width: '240px' }} variant="body1">
          Description
        </Typography>
        <TextInput
          multiline={true}
          rows={5}
          label={'description'}
          onChange={onDescriptionChange}
          value={description}
        />
      </Box>
      <Box sx={{ display: 'flex', margin: '32px 0', paddingLeft: '20px' }}>
        <Typography sx={{ width: '240px' }} variant="body1">
          Url
        </Typography>
        <TextInput label={'url'} onChange={onUrlChange} value={url} />
      </Box>
      <Box sx={{ display: 'flex', margin: '32px 0', paddingLeft: '20px' }}>
        <Typography sx={{ width: '240px' }} variant="body1">
          Genres
        </Typography>
        <SelectBox options={genreData} select={useSelect(setGenre)} value={genre} />
      </Box>
      <Box sx={{ display: 'flex', margin: '32px 0', paddingLeft: '20px' }}>
        <Typography sx={{ width: '240px' }} variant="body1">
          Skills
        </Typography>
        <Box width={'100%'}>
          <CheckBox state={skills} values={skillData} onChange={useCheckBox(skills, setSkills)} />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ marginTop: '24px', paddingRight: '16px' }} display={'flex'} justifyContent={'space-between'}>
        <Typography variant="h6">Setting Period</Typography>
        <PrimarySwitch
          checked={inProduction}
          setChecked={setInProduction}
          onText={'in production'}
          offText={'end'}
        />
      </Box>
      <Box sx={{ display: 'flex', margin: '32px 0', paddingLeft: '20px' }}>
        <Typography sx={{ width: '240px' }} variant="body1">
          Start Date
        </Typography>
        <DateInput
          year={startYear}
          month={startMonth}
          setYear={onStartYearChange}
          setMonth={onStartMonthChange}
        />
      </Box>
      <Box
        sx={
          inProduction === true
            ? { display: 'none' }
            : { display: 'flex', margin: '32px 0', paddingLeft: '20px' }
        }
      >
        <Typography sx={{ width: '240px' }} variant="body1">
          End Date
        </Typography>
        <DateInput year={endYear} month={endMonth} setYear={onEndYearChange} setMonth={onEndMonthChange} />
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} width={isEdit ? '600px' : '300px'} margin={'auto'}>
        <PrimaryButton
          text={isSaving ? '保存中…' : isEdit ? 'Update Content' : 'Create Content'}
          disabled={isSaving || isDeleting}
          onClick={handleSave}
        />
        {isEdit && (
          <>
            <Box width={'32px'} />
            <PrimaryButton
              text={isDeleting ? '削除中…' : 'Delete Content'}
              color={'error'}
              disabled={isSaving || isDeleting}
              onClick={handleDelete}
            />
          </>
        )}
      </Box>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </>
  )
}

export default ContentTemplate
