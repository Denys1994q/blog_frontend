import React from "react"

export type ModalComponentProps = {
    open: boolean, 
    setOpen: (value: React.SetStateAction<boolean>) => void
}