import { redirect } from 'next/navigation'
import { FC } from 'react'

const Home: FC = ({}) => {
    redirect("/landing")
  return <div>page</div>
}

export default Home