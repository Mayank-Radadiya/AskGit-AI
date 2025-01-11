import Image from 'next/image'
import { FC } from 'react'



const Loader: FC = ({}) => {
  return <Image
  src="loader.svg"
  width={80}
  height={80}
  alt='loader'
  />
}

export default Loader
