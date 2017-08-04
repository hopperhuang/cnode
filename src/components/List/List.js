import React from 'react';
import { WhiteSpace } from 'antd-mobile';
import Nav from './nav.js';
import ListItem from './ListItem';
import styles from './List.less';


class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: '',
    };
  }
  render() {
    const { list, dispatch } = this.props;
    const { currentTab, listData, refreshing } = list;
    return (
      <div className={styles.list}>
        <WhiteSpace size="sm" />
        <Nav currentTab={currentTab} />
        <WhiteSpace size="sm" />
        <ListItem
          listData={listData}
          dispatch={dispatch}
          refreshing={refreshing}
        />
      </div>
    );
  }
}

export default List;
