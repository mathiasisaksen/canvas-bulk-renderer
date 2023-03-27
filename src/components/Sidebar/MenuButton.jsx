import useUI from '@/store/ui-store'
import { HamburgerIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import React from 'react'

export default function MenuButton({ ...props }) {
  const [menuIsOpen, toggleMenuIsOpen] = useUI((state) => [state.menuIsOpen, state.toggleMenuIsOpen]);
  return (
    <IconButton variant={!menuIsOpen ? "ghost" : "ghost"} icon={<HamburgerIcon />} onClick={toggleMenuIsOpen} {...props}/>
  )
}
