import { useState } from 'react';
import styles from '../styles/collateral.module.css'

export function Card(prop) {
    const [dataInput, setData] = useState({
        value: '',
        term: '',
      })
      
  return (
    <div className={styles.card}>
      <img src={prop.uri} />
      <div className={styles.inpbutton}>
        <input
          name='Value (Matic)'
          placeholder='Value'
          required
          value={dataInput.value}
          onChange={(e) => setData({ ...dataInput, value: e.target.value })}
        />
        <input
          name='Term'
          placeholder='Term (weeks)'
          required
          value={dataInput.term}
          onChange={(e) => setData({ ...dataInput, term: e.target.value })}
        />
      </div>
      <button className={styles.cltrlbutton} onClick={() => prop.Collateral(prop)}>
        Collateral
      </button>
    </div>
  );
}