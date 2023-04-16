import { getEvent } from '@/lib/api/client/events'
import styles from '../../styles/event-details.module.scss'
import Head from 'next/head'
import { convertDateStringToLocal } from '@/utils/utils'
import { BiEnvelope, BiPhone, BiTime, BiUserCircle } from 'react-icons/bi'
import { GrLocation } from 'react-icons/gr'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { GoogleMap, useLoadScript, Marker, MarkerF } from '@react-google-maps/api'

export default function EventExpanded({ event, isError, message }) {
  const router = useRouter();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });
  const center = useMemo(() => ({ lat: 28.602209465489988, lng: -81.20032572654051 }), []);

  useEffect(() => {
    if (isError)
      router.push('/home');
  }, []);

  if (isError) {
    return (<></>);
  }

  return (
    <>
      <Head>
        <title>Event details for {event.name}</title>
      </Head>
      <main className={styles['main']}>
        <div className={styles['event-container']}>
          <section className={styles['event-header']}>
            {event.type === 'RSO' ? <h2>{event.rso_name}</h2> : <h2>{event.univ_name}</h2>}
            <h2>{event.type} Event</h2>
          <hr />
            <h1 className={styles['event-name']}>{event.name}</h1>
          </section>
          <section className={styles['event-body']}>
            <div className={styles['body-left']}>
              <div className={styles['event-date']}>
                <h3 className={styles['logo-container']}><BiTime className={styles['logo']} /> {event.local_date}</h3>
                <h3>{event.local_time_start} - {event.local_time_end}</h3>
              </div>
              <h3 className={`${styles['event-location']} ${styles['logo-container']}`}><GrLocation className={styles['logo']} /> {event.location_name}</h3>
              <div className={styles['contact-container']}>
                <span className={styles['logo-container']}><BiUserCircle className={styles['logo']} />{event.contact_name}</span>
                <span className={styles['logo-container']}><BiEnvelope className={styles['logo']} />{event.contact_email}</span>
                <span className={styles['logo-container']}><BiPhone className={styles['logo']} />{event.contact_phone}</span>
              </div>
              <h2 className={styles['event-category']}>{event.category}</h2>
            </div>
            <div className={styles['body-right']}>
              {isLoaded && <GoogleMap zoom={15} center={center} mapContainerClassName='map-container'>
                <MarkerF position={center} />
              </GoogleMap>}
            </div>
          </section>
          <section className={styles['description-container']}>
            <hr />
            <h4>About this event</h4>
            <span>{event.description}</span>
          </section>
        </div>
        <div className={styles['review-container']}>
          <h4>Reviews</h4>
          <hr />
          <div>

          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { type, ownerId, eventId } = context.query;
  const authToken = req.headers.cookie?.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
  const response = await getEvent(authToken, eventId, type, ownerId);

  // Capitalize the 'type' of each event
  const event = response.status >= 400 ? {} : {
    ...response.event,
    type: response.event.type === 'rso' ? response.event.type.toUpperCase() : response.event.type.charAt(0).toUpperCase() + response.event.type.slice(1)
  };

  if (response.status === 200) {
    convertDateStringToLocal(event);
  }

  return {
    props: {
      event: event,
      isError: response.status >= 400,
      message: response.status >= 400 ? response.message : ''
    }
  }
}