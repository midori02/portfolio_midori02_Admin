import { ImageType } from '../types/image'

/** Firestore の image フィールド（配列 / 単体オブジェクト両対応）を正規化 */
export const normalizeImages = (value: unknown): ImageType[] | undefined => {
  if (!value) return undefined

  if (Array.isArray(value)) {
    const items = value.filter(
      (item): item is ImageType =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as ImageType).path === 'string' &&
        (item as ImageType).path.length > 0
    )
    return items.length > 0 ? items : undefined
  }

  if (typeof value === 'object' && value !== null && 'path' in value) {
    const item = value as ImageType
    if (typeof item.path === 'string' && item.path.length > 0) {
      return [item]
    }
  }

  return undefined
}

export const isAllowedImageUrl = (url: string): boolean => {
  try {
    const { hostname } = new URL(url)
    return (
      hostname === 'firebasestorage.googleapis.com' ||
      hostname === 'storage.googleapis.com' ||
      hostname.endsWith('.firebasestorage.app')
    )
  } catch {
    return false
  }
}
