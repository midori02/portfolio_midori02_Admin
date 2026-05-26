import { VFC, useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Typography } from '@mui/material'
import { useMutation, useQueryClient } from 'react-query'

import { History } from '../../types/histories'
import { reorderHistories, moveHistory, removeHistory } from '../../lib/histories'
import HistoryCard from './HistoryCard'

type SortableItemProps = {
  history: History
  length: number
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  disabled?: boolean
}

const SortableHistoryItem: VFC<SortableItemProps> = ({
  history,
  length,
  onMoveUp,
  onMoveDown,
  onDelete,
  disabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: history.history_id, disabled: !!disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  }

  return (
    <Box ref={setNodeRef} style={style}>
      <HistoryCard
        history={history}
        length={length}
        upRole={onMoveUp}
        downRole={onMoveDown}
        deleteFunc={onDelete}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
      />
    </Box>
  )
}

type Props = {
  adminId: string
  histories: History[]
}

const HistoryList: VFC<Props> = ({ adminId, histories }) => {
  const queryClient = useQueryClient()
  const [orderedHistories, setOrderedHistories] = useState(histories)

  useEffect(() => {
    setOrderedHistories(histories)
  }, [histories])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const invalidate = () => queryClient.invalidateQueries('histories')

  const reorderMutate = useMutation(
    (orderedIds: string[]) => reorderHistories(adminId, orderedIds),
    {
      onSuccess: () => invalidate(),
      onError: () => {
        setOrderedHistories(histories)
        alert('順番の変更に失敗しました。')
      },
    }
  )

  const moveMutate = useMutation(
    (data: { historyId: string; direction: 'up' | 'down' }) =>
      moveHistory(adminId, data.historyId, data.direction),
    {
      onSuccess: () => invalidate(),
      onError: () => alert('順番の変更に失敗しました。'),
    }
  )

  const deleteMutate = useMutation(
    (id: string) => removeHistory(adminId, id),
    {
      onSuccess: () => invalidate(),
      onError: () => alert('削除に失敗しました。'),
    }
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = orderedHistories.findIndex((h) => h.history_id === active.id)
    const newIndex = orderedHistories.findIndex((h) => h.history_id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const next = arrayMove(orderedHistories, oldIndex, newIndex)
    setOrderedHistories(next)
    reorderMutate.mutate(next.map((h) => h.history_id))
  }

  if (orderedHistories.length === 0) {
    return <Typography>Histories not found...</Typography>
  }

  const isBusy =
    reorderMutate.isLoading || moveMutate.isLoading || deleteMutate.isLoading

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedHistories.map((h) => h.history_id)}
        strategy={verticalListSortingStrategy}
      >
        {orderedHistories.map((history) => (
          <SortableHistoryItem
            key={history.history_id}
            history={history}
            length={orderedHistories.length}
            disabled={isBusy}
            onMoveUp={() =>
              moveMutate.mutate({ historyId: history.history_id, direction: 'up' })
            }
            onMoveDown={() =>
              moveMutate.mutate({ historyId: history.history_id, direction: 'down' })
            }
            onDelete={() => deleteMutate.mutate(history.history_id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}

export default HistoryList
