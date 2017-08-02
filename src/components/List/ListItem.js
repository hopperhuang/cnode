import React from 'react';
import { ListView, WingBlank } from 'antd-mobile';
import { Link } from 'dva/router';
// import styles from './ListItem.less';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }
  renderRow(listData) {
    console.log(listData);
    const { tab, author, title, reply_count, visit_count, last_reply_at, id } = listData;
    const { avatar_url } = author;
    console.log('renderRow');
    return (
      // <Link to={`/topic/${id}`}>
      //   <WingBlank>
      //     <img role="presentation" src={avatar_url} />
      //     <span>{tab}</span>
      //     <span>{title}</span>
      //     <span>{reply_count}/{visit_count}</span>
      //     <span>{last_reply_at}</span>
      //   </WingBlank>
      // </Link>
      <p>这里是data</p>
    );
  }
  render() {
    const { listData } = this.props;
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dataSource = ds.cloneWithRows(listData);
    return (
      <ListView
        dataSource={dataSource}
        renderRow={this.renderRow}
        pageSize={20}
      />
    );
  }
}
export default ListItem;
