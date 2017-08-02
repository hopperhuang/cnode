import React from 'react';
import styles from './IndexPage.css';
import Header from '../components/Header/Header';


function IndexPage(props) {
  const { children } = props;
  return (
    <div className={styles.normal}>
      <Header />
      {children}
    </div>
  );
}

IndexPage.propTypes = {
};

export default IndexPage;
