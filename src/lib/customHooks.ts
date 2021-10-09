import React, { useCallback, SetStateAction, Dispatch } from 'react'

//文字列に対するonChangeに使用
export const useStringChangeEvent = (update: Dispatch<SetStateAction<string>>) => {
  return useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      update(event.target.value)
    },
    [update]
  )
}

//selectBoxに対するonChangeに使用
export const useSelect = (update: Dispatch<SetStateAction<string>>) => {
  return useCallback(
    (value: string) => {
      update(value)
    },
    [update]
  )
}

//checkBoxに対するonChangeに使用(string[])
export const useCheckBox = (state: string[], update: React.Dispatch<React.SetStateAction<string[]>>) => {
  return useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const valueName = event.target.name
      if (state.some((data) => data === valueName)) {
        const nextState = state.filter((data) => data !== valueName)
        update([...nextState])
      } else {
        update((prevState) => [...prevState, valueName])
      }
    },
    [state, update]
  )
}
