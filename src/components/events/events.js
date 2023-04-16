import { useRouter } from 'next/router';
import styles from './styles/events.module.scss'
import { useRef } from 'react'
import { BiTime } from 'react-icons/bi'
import { GrLocation } from 'react-icons/gr'
import Link from 'next/link';

export default function Events({ events }) {
  const titleRef = useRef(null);
  const router = useRouter();

  const handleClick = (event) => {
    router.push(`/events/${(event.type).toLowerCase()}/${event.type === 'RSO' ? event.rso_id : event.univ_id}/${event.event_id}`);
  };

  return (
    <section className={styles['events-grid']}>
      {events.map((event, index) =>
        <div key={index} className={`${styles['event-box']} ${((index + 1) > events.length - (events.length % 3)) ? styles['no-grow'] : ''}`} onClick={() => handleClick(event)}>
          <div className={styles['event-details-container']}>
            <div className={styles['event-details']}>
              <div className={styles['event-type']}>
                {event.type === 'RSO' ? <h3>{event.rso_name}</h3> : <h3>{event.abbreviation}</h3>}
                <h3>{event.type} Event</h3>
              </div>
              <h2 ref={titleRef} className={styles['event-title']}>{event.name}</h2>
              <span className={styles['event-date']}><BiTime className={styles['logo']} /> {event.local_date}</span>
              <span className={styles['event-location']}><GrLocation className={styles['logo']} /> {event.location_name}</span>
            </div>
            <div className={styles['event-footer']}>
              <span className={styles['event-category']}>{event.category}</span>
              <hr />
              <span className={styles['event-owner']}>{event.contact_name}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}