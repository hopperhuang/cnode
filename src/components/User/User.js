import React from 'react';
import { ActivityIndicator, WingBlank, WhiteSpace } from 'antd-mobile';
import { Link } from 'dva/router';
import resolveDate from '../../utils/resolveDate';
import styles from './User.less';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmout() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/clear',
    });
  }
  render() {
    const { userInformation } = this.props;
    const { informationData, collectionData } = userInformation;
    if (!informationData) {
      return (
        <ActivityIndicator text="玩命加载中" />
      );
    }
    const {
      loginname,
      avatar_url,
      create_at,
      score,
      recent_topics,
      recent_replies,
    } = informationData;
    return (
      <WingBlank size="sm">
        <WhiteSpace />
        <div className={styles.information}>
          <div>
            <img role="presentation" src={avatar_url} />
          </div>
          <div className={styles.textInformation}>
            <p className={styles.loginname}>{loginname}</p>
            <p className={styles.score}>{score}积分</p>
            <p className={styles.time}>创建时间{resolveDate(create_at)}</p>
          </div>
          <WhiteSpace />
        </div>
        <WhiteSpace />
        <div>
          <div className={styles.headerTitle}>收藏的话题</div>
          <WhiteSpace />
          <div>
            {collectionData.map((collection) => {
              return (
                <div key={collection.id} className={styles.itemContainer}>
                  <div className={styles.itemImage}>
                    <Link to={`/user/${collection.author.loginname}`}>
                      <img role="presentation" src={collection.author.avatar_url} />
                    </Link>
                  </div>
                  <div className={styles.itemTitle}><Link className={styles.titleLink} to={`/topic/${collection.id}`}>{collection.title}</Link></div>
                </div>
              );
            })}
          </div>
        </div>
        <WhiteSpace />
        <div>
          <div className={styles.headerTitle}>最近发表的话题</div>
          <WhiteSpace />
          <div>
            {recent_topics.map((topic) => {
              return (
                <div key={topic.id} className={styles.itemContainer}>
                  <div className={styles.itemImage}>
                    <Link to={`/user/${topic.author.loginname}`}>
                      <img role="presentation" src={topic.author.avatar_url} />
                    </Link>
                  </div>
                  <div className={styles.itemTitle}><Link className={styles.titleLink} to={`/topic/${topic.id}`}>{topic.title}</Link></div>
                </div>
              );
            })}
          </div>
        </div>
        <WhiteSpace />
        <div>
          <div className={styles.headerTitle}>最近参与的话题</div>
          <WhiteSpace />
          <div>
            {recent_replies.map((topic) => {
              return (
                <div key={topic.id} className={styles.itemContainer}>
                  <div className={styles.itemImage}>
                    <Link to={`/user/${topic.author.loginname}`}>
                      <img role="presentation" src={topic.author.avatar_url} />
                    </Link>
                  </div>
                  <div className={styles.itemTitle}><Link className={styles.titleLink} to={`/topic/${topic.id}`}>{topic.title}</Link></div>
                </div>
              );
            })}
          </div>
        </div>
      </WingBlank>
    );
  }
}

export default User;
