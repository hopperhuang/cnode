import React from 'react';
import { Button, WhiteSpace } from 'antd-mobile';
import { Link } from 'dva/router';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, ContentState } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import resolveDate from '../../utils/resolveDate';
import judgeAccesstoken from '../../utils/judgeAccesstoken';
import styles from './replyItem.less';


// reply 点赞handler 评论handler haveToken
// haveToken为true时，显示点赞数量，点赞图标和评论框。
class ReplyItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditor: false,
      commentContent: convertToRaw(ContentState.createFromText('')),
    };
    this.onContentStateChange = this.onContentStateChange.bind(this);
    this.showEditor = this.showEditor.bind(this);
    this.commentThisReply = this.commentThisReply.bind(this);
  }
  onContentStateChange(content) {
    this.setState({
      commentContent: content,
    });
  }
  showEditor() {
    const { reply } = this.props;
    const { author } = reply;
    const { loginname } = author;
    this.setState({
      showEditor: true,
      commentContent: convertToRaw(ContentState.createFromText(`@${loginname} `)),
    });
  }
  commentThisReply() {
    const { reply, dispatch } = this.props;
    const reply_id = reply.id;
    const rawContent = this.state.commentContent;
    const content = draftToMarkdown(rawContent);
    dispatch({
      type: 'topic/submitComment',
      payload: {
        reply_id,
        content,
      },
    });
    this.setState({
      commentContent: '',
      showEditor: false,
    });
  }
  render() {
    const { reply } = this.props;
    const { author, create_at, ups, is_uped, content } = reply;
    const { loginname, avatar_url } = author;
    const createTime = resolveDate(create_at);
    const haveToken = judgeAccesstoken();
    const { showEditor, commentContent } = this.state;
    return (
      <div>
        <div className={styles.replyContainer}>
          <div>
            <span>
              <Link to={`/user/${loginname}`}>
                <img className={styles.avatar} role="presentation" src={avatar_url} />
              </Link>
            </span>
          </div>
          <div>
            <div className={styles.informationAndComment}>
              <div className={styles.informationContainer}>
                <p className={styles.name}>{loginname}</p>
                <p className={styles.createTime}>创建于：{createTime}</p>
                <p className={styles.upCount}>点赞数量：{ups.length}</p>
              </div>
              <div className={styles.buttonContainer}>
                {haveToken ? is_uped ? <Button className={styles.replyOrCommmentButton}>已点赞</Button> : <Button className={styles.replyOrCommmentButton}>给他点赞</Button> : ''}
                {haveToken ? <Button onClick={this.showEditor} className={styles.replyOrCommmentButton}>回复评论</Button> : ''}
              </div>
            </div>
            <div className={styles.replyContent} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <WhiteSpace />
        </div>
        { showEditor ? <Editor
          toolbarClassName={styles.editor_toolbar}
          contentState={commentContent}
          wrapperClassName="wrapperClassName"
          editorClassName={styles.editor_area}
          onContentStateChange={this.onContentStateChange}
        /> : ''}
        { showEditor ? <Button onClick={this.commentThisReply}>评论该回复</Button> : ''}
      </div>
    );
  }
}
export default ReplyItem;
