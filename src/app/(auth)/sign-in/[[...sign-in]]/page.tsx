import { SignIn } from '@clerk/nextjs'
import { FC } from 'react'


const page: FC = () => {
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      <SignIn />
    </div>
  );
}

export default page