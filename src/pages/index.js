import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import NavBar from '@/components/navBar'
import EventsContainer from '@/components/eventsContainer'
import EventsSideBar from '@/components/eventsSideBar'

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NavBar />
      <main className={styles.main}>
        <EventsSideBar />
        <EventsContainer />
      </main>
    </>
  )
}
