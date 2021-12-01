import React, { createContext, ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'
import { kebabCase } from 'lodash'
import { Toast, toastTypes } from 'maki-toolkit-v2'
import { ToastContextApi } from './types'

export const ToastsContext = createContext<ToastContextApi>(undefined)

const StyledToastContainer = styled.div`
  & .enter-done > div {
    background-color: #caddf7;
  }
`

export const ToastsProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<ToastContextApi['toasts']>([])

  const toast = useCallback(
    ({ title, description, type }: Omit<Toast, 'id'>) => {
      setToasts((prevToasts) => {
        const id = kebabCase(title)

        // Remove any existing toasts with the same id
        const currentToasts = prevToasts.filter((prevToast) => prevToast.id !== id)

        return [
          {
            id,
            title,
            description,
            type,
          },
          ...currentToasts,
        ]
      })
    },
    [setToasts],
  )

  const toastError = (title: string, description?: ReactNode) => {
    return toast({ title, description, type: toastTypes.DANGER })
  }
  const toastInfo = (title: string, description?: ReactNode) => {
    return toast({ title, description, type: toastTypes.INFO })
  }
  const toastSuccess = (title: string, description?: ReactNode) => {
    return toast({ title, description, type: toastTypes.SUCCESS })
  }
  const toastWarning = (title: string, description?: ReactNode) => {
    return toast({ title, description, type: toastTypes.WARNING })
  }
  const clear = () => setToasts([])
  const remove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  }

  return (
    <ToastsContext.Provider value={{ toasts, clear, remove, toastError, toastInfo, toastSuccess, toastWarning }}>
      <StyledToastContainer>{children}</StyledToastContainer>
    </ToastsContext.Provider>
  )
}