import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { WingBlank, WhiteSpace, Flex, ActivityIndicator, Button } from 'antd-mobile';
import { Link } from 'dva/router';
import styles from './topic.less';
import resolveDate from '../../utils/resolveDate';
import judgeAccesstoken from '../../utils/judgeAccesstoken';
import ReplyItem from './replyItem';

const FlexItem = Flex.Item;
class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentContent: '',
    };
    this.onContentStateChange = this.onContentStateChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.collectTopic = this.collectTopic.bind(this);
    this.deCollectTopic = this.deCollectTopic.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  componentDidMount() {
    // const { history } = this.props;
    // history.goBack();
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'topic/clearData',
    });
  }
  onContentStateChange(content) {
    this.setState({
      commentContent: content,
    });
  }
  submitComment() {
    const rawContent = this.state.commentContent;
    console.log(rawContent);
    const content = draftToMarkdown(rawContent);
    console.log(content);
    const { dispatch } = this.props;
    dispatch({
      type: 'topic/submitComment',
      payload: {
        content,
      },
    });
    this.setState({
      commentContent: '',
    });
  }
  collectTopic() {
    const { dispatch } = this.props;
    dispatch({
      type: 'topic/collectTopic',
    });
  }
  deCollectTopic() {
    const { dispatch } = this.props;
    dispatch({
      type: 'topic/deCollectTopic',
    });
  }
  goBack() {
    const { history } = this.props;
    history.goBack();
  }
  render() {
    const { topic, dispatch } = this.props;
    const { topicData, topicId } = topic;
    // 做一层拦截，放置没有拉取数据的时候报错。
    if (!topicData.author) {
      return (
        <ActivityIndicator text="玩命加载中" />
      );
    }
    const {
      title,
      create_at,
      author,
      visit_count,
      is_collect,
      content,
      reply_count,
      replies,
      author_id,
    } = topicData;
    const { loginname } = author;
    const createTime = resolveDate(create_at);
    const replyItems = replies.map(reply => <ReplyItem dispatch={dispatch} reply={reply} key={reply.id} />);
    const haveToken = judgeAccesstoken();
    const userID = localStorage.getItem('cnode-personalID');
    const { commentContent } = this.state;
    return (
      <div>
        <div className={styles.goBackContainer}>
          <Button onClick={this.goBack} className={styles.goBack}>返回</Button>
          { haveToken && author_id === userID ? <Link to={`/update?topicId=${topicId}`}><Button className={styles.keep} >编辑文章</Button></Link> : ''}
          { haveToken ? is_collect ?
            <Button onClick={this.deCollectTopic} className={styles.keep}>取消收藏</Button> :
            <Button onClick={this.collectTopic} className={styles.keep}>收藏</Button> : ''}
        </div>
        <WingBlank>
          <h1 className={styles.title}>{title}</h1>
          <WhiteSpace size="sm" />
          <Flex>
            <FlexItem>
              <span className={styles.createTime}>发表于：{createTime}</span>
            </FlexItem>
            <FlexItem>
              <span className={styles.author}>作者：<Link to={`/user/${loginname}`}>{loginname}</Link></span>
            </FlexItem>
            <FlexItem>
              <span className={styles.visitCount}>浏览次数：{visit_count}</span>
            </FlexItem>
          </Flex>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
          <WhiteSpace />
          <div className={styles.replyCount}>回复：{reply_count}</div>
          <WhiteSpace />
          {replyItems}
          <WhiteSpace />
          { haveToken ? <Editor
            toolbarClassName={styles.editor_toolbar}
            contentState={commentContent}
            wrapperClassName="wrapperClassName"
            editorClassName={styles.editor_area}
            onContentStateChange={this.onContentStateChange}
          /> : '' }
          { haveToken ? <WhiteSpace /> : ''}
          { haveToken ? <Button onClick={this.submitComment}>提交评论</Button> : ''}
        </WingBlank>
      </div>
    );
  }
}

export default Topic;
