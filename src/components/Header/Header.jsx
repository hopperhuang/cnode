import React from 'react';
import { WingBlank, WhiteSpace } from 'antd-mobile';
import logo from './cnodejs_light.svg';
import styles from './Header.less';
import SearchBar from './SearchBar';
import NavBar from './NavBar';

const Header = function Header() {
  return (
    <div className={styles.headerBar} >
      <WhiteSpace />
      <WingBlank size="lg">
        <img role="presentation" src={logo} />
        <WhiteSpace />
        <SearchBar />
        <WhiteSpace />
        <NavBar />
      </WingBlank>
      <WhiteSpace />
    </div>
  );
};

export default Header;
