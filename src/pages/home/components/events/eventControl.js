import styles from './styles/events-control.module.css'

// Display event grid control options
export default function EventControl({ title }) {
  return (
    <div className={styles['events-control']}>
      <h1>{title}</h1>
      <div className={styles['button-container']}>
        <button className={styles['control-button']}>Sort</button>
        <button className={styles['control-button']}>Filter</button>
      </div>
    </div>
  )
}