import EventsSideBar from './components/events/eventSideBar'
import EventsControl from './components/events/eventControl'
import ProfilePreview from './components/profile-preview';
import { convertDateStringToLocal } from '@/utils/utils';
import Events from './components/events/events';
import styles from './styles/home.module.css'
import NavBar from '@/components/layout/components/navBar'
import { useEffect, useState } from 'react'
import data from '@/data/today.json'
import Head from 'next/head'
import Layout from '@/components/layout';

export default function Home({ events }) {
  // Event list state
  const [selected, setSelected] = useState('this-week');
  const [title, setTitle] = useState('This week');

  // Convert selected into title
  useEffect(() => {
    const modifyTitle = (newTitle) => {
      // Replace dashes (-) with a space ( )
      newTitle = newTitle.replace(/-/g, " ");

      // Capitalize first letter
      if (selected == 'this-week' || selected == 'this-month') {
        newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
      }
      // Capitalize first letter per word
      else {
        newTitle = newTitle.replace(/(^|\s)\w/g, (match) => {
          return match.toUpperCase();
        })
      }

      return newTitle;
    };

    setTitle(modifyTitle(selected));
  }, [selected]);

  return (
    <Layout>
      <Head>
        <title>Event tracker</title>
      </Head>
      {/* <NavBar /> */}
      <main className="main">
        <div className={styles['home-container']}>
          <EventsSideBar selected={selected} setSelected={setSelected} />
          <div className={styles['events-container']}>
            <EventsControl title={title} />
            <hr className="main-hr" />
            <Events events={events} />
          </div>
          <ProfilePreview />
        </div>
      </main>
    </Layout>
  )
}

//TODO timezone error when converting date to Fri, Apr 13 2023 8:00 AM
//TODO .split not working bc data isnt existent when convertDateStringToLocal(events) is called
/* Return list of events with their descriptions */
export async function getStaticProps() {
  const events = data;

  return {
    props: {
      events: convertDateStringToLocal(events)
    },
  }
}