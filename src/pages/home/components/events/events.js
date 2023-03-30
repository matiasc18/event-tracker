import styles from './styles/events.module.css'
import { useRef } from 'react'

export default function Events({ events }) {
  const titleRef = useRef(null);

  return (
    <section className={styles['events-grid']}>
      {events.map((event, index) =>
        <div key={index} className={`${styles['event-box']} ${((index + 1) > events.length - (events.length % 3)) ? styles['no-grow'] : ''}`}>
          <div className={styles['event-details-container']}>
            <div className={styles['event-details']}>
              <span className={styles['event-date']}>{event.starts}</span>
              <h2 ref={titleRef} className={styles['event-title']}>{event.title}</h2>
              <span className={styles['event-location']}>{event.location}</span>
            </div>
            <div>
              <hr />
              <div className={styles[['event-owner']]}>
                <span>{event.contact_name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}