import React from 'react';
import { WhiteSpace } from 'antd-mobile';
import Nav from './nav.js';
import ListItem from './ListItem';


class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: '',
    };
  }
  render() {
    const { list } = this.props;
    const { currentTab, listData } = list;
    console.log(list);
    return (
      <div>
        <WhiteSpace />
        <Nav currentTab={currentTab} />
        <WhiteSpace />
        <ListItem listData={listData} />
      </div>
    );
  }
}

export default List;
