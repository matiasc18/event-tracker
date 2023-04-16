import EventControl from '@/components/events/eventControl'
import EventSideBar from '@/components/events/eventSideBar'
import { convertDateStringToLocal } from '@/utils/utils'
import Events from '../../components/events/events'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { getAllEvents } from '@/lib/api/client/events'

// Remove dash and capitalize title
const modifyTitle = (selected) => {
  let newTitle = selected;
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

export default function Home({ events }) {
  // Event list state
  const [selected, setSelected] = useState('this-week');
  const [title, setTitle] = useState('This week');

  // Convert id to proper title
  useEffect(() => {
    setTitle(modifyTitle(selected));
  }, [selected]);

  return (
    <>
      <Head>
        <title>Event tracker</title>
      </Head>
      <main className="main" id="top">
        <div className="home-container">
          <EventSideBar selected={selected} setSelected={setSelected} />
          <div className="events-container">
            <EventControl title={title} />
            <hr className="main-hr" />
            <Events events={events} />
          </div>
        </div>
      </main>
    </>
  )
}

// Get all events viewable to the user
export async function getServerSideProps(context) {
  const { req } = context;
  const authToken = req.headers.cookie?.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
  const response = await getAllEvents(authToken);

  // Sort most recent
  response.sort((a, b) => new Date(a.date) - new Date(b.date));
  // Capitalize the 'type' of each event
  const events = response.map((event) => {
    return {
      ...event,
      type: event.type === 'rso' ? event.type.toUpperCase() : event.type.charAt(0).toUpperCase() + event.type.slice(1)
    };
  });
  convertDateStringToLocal(events);

  return {
    props: {
      events: events
    }
  }
}