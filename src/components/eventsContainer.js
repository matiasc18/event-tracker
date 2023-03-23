import styles from '@/styles/Events.module.css'
import { useEffect, useRef } from 'react'

const eventNames = ['UCF vs. UF', 'Comedy Night', 'JavaScript Fundamentals Talk', 'Resume Reviewing', 'LAN Party (Halo, Smash Bros, FIFA', 'All-you-can-eat buffet', 'Campus Tour', 'Hackathon', 'Talent Show']

export default function EventsContainer() {
  const titleRef = useRef(null);

  useEffect(() => {
    const titles = document.querySelectorAll(`.${styles['event-title']}`);
    const eventBox = document.querySelector(`.${styles['event-box']}`);

    if (titles.length) {
      titles.forEach((title) => {
        if (title.scrollWidth > eventBox.scrollWidth) {
          title.classList.add('scrollable');
        }
      })
    }
  }, [typeof window !== "undefined" && window.document.readyState]);

  return (
    <section className={styles['event-container']}>
      {eventNames.map((eventName) =>
        <div key={eventName} className={styles['event-box']}>
          <div className={styles['event-photo']}></div>
          <h2 ref={titleRef} className={styles['event-title']}>{eventName}</h2>
          <hr />
          <span className={styles['event-description']}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet ex, dolores dolorum porro voluptate ab?</span>
        </div>
      )}
    </section>
  )
}