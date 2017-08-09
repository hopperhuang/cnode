import React from 'react';
import { ListView, WingBlank, RefreshControl } from 'antd-mobile';
import { Link } from 'dva/router';
import styles from './ListItem.less';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.onEndReachedHandler = this.onEndReachedHandler.bind(this);
    this.onRefreshHandler = this.onRefreshHandler.bind(this);
  }
  componentDidMount() {
    // 完成加载后将list添加到redux，便于拉去信息后，调用scrollTo方法
    // 将位置回调到(0,0)
    const { dispatch } = this.props;
    const { myList } = this;
    dispatch({
      type: 'list/addMyListToRedux',
      component: myList,
    });
  }
  onEndReachedHandler() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetchData',
      payload: {
        jumpOrPull: 'pull',
      },
    });
  }
  onRefreshHandler() {
    const { dispatch } = this.props;
    dispatch({ type: 'list/refresh' });
  }
  renderRow(listData) {
    const { tab, author, title, reply_count, visit_count, last_reply_at, id } = listData;
    const { avatar_url, loginname } = author;
    const reply_time = new Date(last_reply_at).toString().split(' ').splice(1, 3)
    .join('-');
    return (
      <WingBlank size="sm">
        <Link className={styles.listItem} to={`/topic/${id}`}>
          <div className={styles.flexBox}>
            <div className={styles.flexImg}>
              <Link to={`/user/${loginname}`}>
                <img className={styles.avatar} role="presentation" src={avatar_url} />
              </Link>
            </div>
            <div className={styles.flexTab}>
              <span className={styles.tab}>{tab}</span>
            </div>
            <div className={styles.flexTitle}>
              <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.flexCommentAndRead}>
              <span className={styles.commentAndRead}>{reply_count}/{visit_count}</span>
            </div>
            <div className={styles.flexDate}>
              <span className={styles.time}>{reply_time.toString()}</span>
            </div>
          </div>
        </Link>
      </WingBlank>
    );
  }
  render() {
    const { listData, refreshing } = this.props;
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dataSource = ds.cloneWithRows(listData);
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 4,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    return (
      <ListView
        ref={(c) => { this.myList = c; }}
        dataSource={dataSource}
        initialListSize={20}
        renderRow={this.renderRow}
        pageSize={20}
        renderSeparator={separator}
        onEndReached={this.onEndReachedHandler}
        onEndReachedThreshold={20}
        scrollEventThrottle={200}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.onRefreshHandler}
          />
        }
      />
    );
  }
}
export default ListItem;
