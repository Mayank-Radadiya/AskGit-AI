"use client"
import { useUser } from '@clerk/nextjs'
import { FC } from 'react'


const page: FC = ({}) => {
  const {user} = useUser()
  return <div> Hello </div>

}

export default page