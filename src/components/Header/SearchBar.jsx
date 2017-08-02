import React from 'react';
import { SearchBar } from 'antd-mobile';
import styles from './SearchBar.less';

class SearchBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: '',
      value: '',
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.ongSubmitHandler = this.ongSubmitHandler.bind(this);
  }
  onChangeHandler(value) {
    this.setState({
      value,
    });
  }
  ongSubmitHandler(value) {
    const href = `https://www.google.com.hk/search?hl=zh-CN&q=site:cnodejs.org+${encodeURIComponent(value)}&cad=h`;
    window.location.href = href;
  }
  render() {
    const { value, defaultValue } = this.state;
    return (
      <div className={styles.searchBarContainer}>
        <SearchBar
          value={value}
          defaultValue={defaultValue}
          onChange={this.onChangeHandler}
          onSubmit={this.ongSubmitHandler}
        />
      </div>
    );
  }
}

export default SearchBarComponent;
