import { adminsRef, db, firebaseTimeStamp } from '../firebase/index'
import { isValidRequiredInput } from './validation'

import { History } from '../types/histories'

const historiesCol = (adminId: string) =>
  adminsRef.doc(adminId).collection('histories')

const isRoleSequenceValid = (items: History[]): boolean => {
  if (items.length === 0) return true
  const sorted = [...items].sort((a, b) => a.role - b.role)
  const roles = sorted.map((h) => h.role)
  return (
    new Set(roles).size === roles.length &&
    sorted.every((h, i) => h.role === i + 1)
  )
}

/** role を 1..n に振り直す（欠番・重複の修復） */
export const reindexHistoryRoles = async (adminId: string): Promise<void> => {
  const snapshots = await historiesCol(adminId).orderBy('role', 'asc').get()
  if (snapshots.empty) return

  const batch = db.batch()
  let hasWrites = false
  snapshots.docs.forEach((doc, index) => {
    const newRole = index + 1
    if (doc.data().role !== newRole) {
      batch.set(doc.ref, { role: newRole }, { merge: true })
      hasWrites = true
    }
  })
  if (hasWrites) {
    await batch.commit()
  }
}

const loadHistoriesOrdered = async (adminId: string): Promise<History[]> => {
  const snapshots = await historiesCol(adminId).orderBy('role', 'asc').get()
  const items: History[] = []
  snapshots.forEach((snapshot) => {
    items.push(snapshot.data() as History)
  })
  return items
}

export const fetchHistories = async (
  adminId: string
): Promise<History[] | undefined> => {
  try {
    let items = await loadHistoriesOrdered(adminId)
    if (!isRoleSequenceValid(items)) {
      await reindexHistoryRoles(adminId)
      items = await loadHistoriesOrdered(adminId)
    }
    return items
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const createHistory = (history: {
  admin_id: string
  event: string
  year: number
  month: number
  role: number
}): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const { event, admin_id, year, month } = history
    if (!isValidRequiredInput(event)) {
      alert('内容が未入力です。ご確認ください。')
      reject(undefined)
      return
    }
    if (!window.confirm('この内容で作成しますか？')) {
      reject(undefined)
      return
    }

    void (async () => {
      try {
        const existing = await loadHistoriesOrdered(admin_id)
        const nextRole =
          existing.length === 0
            ? 1
            : Math.max(...existing.map((h) => h.role)) + 1
        const history_id = historiesCol(admin_id).doc().id
        const historyData = {
          admin_id,
          created_at: firebaseTimeStamp.now(),
          event,
          history_id,
          year,
          month,
          role: nextRole,
          updated_at: firebaseTimeStamp.now(),
        }
        await historiesCol(admin_id).doc(history_id).set(historyData)
        resolve('created history')
      } catch (error) {
        console.error(error)
        reject(undefined)
      }
    })()
  })
}

export const removeHistory = (
  adminId: string,
  id: string
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    if (!window.confirm('本当に削除しますか？')) {
      reject(undefined)
      return
    }

    void (async () => {
      try {
        await historiesCol(adminId).doc(id).delete()
        await reindexHistoryRoles(adminId)
        resolve('deleted')
      } catch (error) {
        console.error(error)
        reject(undefined)
      }
    })()
  })
}

export const reorderHistories = async (
  adminId: string,
  orderedIds: string[]
): Promise<string | undefined> => {
  try {
    if (orderedIds.length === 0) return 'reordered'
    const batch = db.batch()
    orderedIds.forEach((id, index) => {
      batch.set(
        historiesCol(adminId).doc(id),
        { role: index + 1 },
        { merge: true }
      )
    })
    await batch.commit()
    return 'reordered'
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const moveHistory = (
  adminId: string,
  historyId: string,
  direction: 'up' | 'down'
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    void (async () => {
      try {
        let items = await loadHistoriesOrdered(adminId)
        if (!isRoleSequenceValid(items)) {
          await reindexHistoryRoles(adminId)
          items = await loadHistoriesOrdered(adminId)
        }

        const index = items.findIndex((h) => h.history_id === historyId)
        if (index < 0) {
          reject(undefined)
          return
        }

        const swapIndex = direction === 'up' ? index - 1 : index + 1
        if (swapIndex < 0 || swapIndex >= items.length) {
          reject(undefined)
          return
        }

        const reordered = [...items]
        ;[reordered[index], reordered[swapIndex]] = [
          reordered[swapIndex],
          reordered[index],
        ]

        const result = await reorderHistories(
          adminId,
          reordered.map((item) => item.history_id)
        )
        if (!result) {
          reject(undefined)
          return
        }
        resolve('moved')
      } catch (error) {
        console.error(error)
        reject(undefined)
      }
    })()
  })
}

/** @deprecated moveHistory を使用 */
export const updateHistoryRole = (
  adminId: string,
  historyId: string,
  update: number,
  currentNum: number
): Promise<string | undefined> => {
  const direction = update < currentNum ? 'up' : 'down'
  return moveHistory(adminId, historyId, direction)
}
