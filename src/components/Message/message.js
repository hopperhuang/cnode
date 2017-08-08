import React from 'react';
import { Link } from 'dva/router';
import { WingBlank, WhiteSpace, ActivityIndicator, Button } from 'antd-mobile';
import styles from './message.less';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.transformMessageToHTML = this.transformMessageToHTML.bind(this);
    this.markOneMessage = this.markOneMessage.bind(this);
    this.markAllMessage = this.markAllMessage.bind(this);
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/clear',
    });
  }
  transformMessageToHTML(messages, unRead) {
    return messages.length === 0 ? '暂无未读消息' : messages.map((message) => {
      return (
        <div className={styles.item} key={message.id}>
          <WhiteSpace size="sm" />
          <Link className={styles.nameLink} to={`/user/${message.author.loginname}`}>{message.author.loginname}</Link>
          &nbsp;回复了你的帖子&nbsp;
          {unRead ? <Link className={styles.titleLink} onClick={this.markOneMessage(message.id, message.topic.id)} >{message.topic.title}</Link> :
          <Link className={styles.titleLink} to={`/topic/${message.topic.id}`}>{message.topic.title}</Link>}
          {unRead ? <Button onClick={this.markOneMessage(message.id)}>标记为已读</Button> : ''}
          <WhiteSpace size="sm" />
        </div>
      );
    });
  }
  markOneMessage(messgeId, topicID) {
    const { dispatch } = this.props;
    return () => {
      dispatch({
        type: 'message/markOneMessage',
        payload: {
          messgeId,
          topicID,
        },
      });
    };
  }
  markAllMessage() {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/markAllMessage',
    });
  }
  render() {
    const { message } = this.props;
    if (!message.data) {
      return (
        <ActivityIndicator text="玩命加载中" />
      );
    }
    const { has_read_messages, hasnot_read_messages } = message.data;
    return (
      <WingBlank size="sm">
        <h1 className={styles.head}>未读消息</h1>
        <WhiteSpace />
        {this.transformMessageToHTML(hasnot_read_messages, true)}
        <WhiteSpace />
        {hasnot_read_messages.length > 0 ? <Button onClick={this.markAllMessage} className={styles.markAll}>全部标记为已读</Button> : ''}
        <WhiteSpace />
        <h1 className={styles.head}>过往的消息</h1>
        {this.transformMessageToHTML(has_read_messages, false)}
      </WingBlank>
    );
  }
}

export default Message;
