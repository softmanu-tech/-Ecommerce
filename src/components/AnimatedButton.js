import React from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import styles from './AnimatedButton.module.css';

const AnimatedButton = ({ direction, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`${styles.btnSlide} ${direction === 'left' ? styles.btnSlideLeft : styles.btnSlideRight}`}
    >
      <span className={styles.iconWrapper}>
        <span className={styles.icon}>
          {direction === 'left' ? <FaAngleLeft /> : <FaAngleRight />}
        </span>
      </span>
      <span className={styles.pulse}></span>
    </button>
  );
};

export default AnimatedButton;