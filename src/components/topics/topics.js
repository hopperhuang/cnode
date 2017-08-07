import React from 'react';
import { Flex, WhiteSpace, WingBlank, TextareaItem, Button, Toast } from 'antd-mobile';
import styles from './topics.less';

const FlexItem = Flex.Item;
class Topics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: 'dev',
      title: '',
      texAreaDefaultValue: '',
      textAreaValue: '',
    };
    this.selectorOnChange = this.selectorOnChange.bind(this);
    this.textAreaOnChange = this.textAreaOnChange.bind(this);
    this.titleInputOnChange = this.titleInputOnChange.bind(this);
    this.postWrite = this.postWrite.bind(this);
    this.editWrite = this.editWrite.bind(this);
  }
  componentWillMount() {
    const { topics } = this.props;
    if (topics) {
      const { content, title, tab } = topics;
      this.setState({
        title,
        selectedValue: tab,
        texAreaDefaultValue: content,
      });
    }
  }
  selectorOnChange(event) {
    const { value } = event.target;
    this.setState({
      selectedValue: value,
    });
  }
  titleInputOnChange(event) {
    const { value } = event.target;
    this.setState({
      title: value,
    });
  }
  textAreaOnChange(value) {
    this.setState({
      textAreaValue: value,
    });
  }
  postWrite() {
    const { dispatch } = this.props;
    const { textAreaValue, title, selectedValue } = this.state;
    if (title.length < 10) {
      Toast.info('标题长度小于10', 2);
      return;
    }
    if (textAreaValue.length <= 0) {
      Toast.info('请输入内容', 2);
      return;
    }
    dispatch({
      type: 'topics/postYourWrite',
      payload: {
        title,
        content: textAreaValue,
        tab: selectedValue,
      },
    });
  }
  editWrite() {
    const { dispatch } = this.props;
    const { textAreaValue, title, selectedValue, texAreaDefaultValue } = this.state;
    if (title.length < 10) {
      Toast.info('标题长度小于10', 2);
      return;
    }
    if (textAreaValue.length <= 0 && texAreaDefaultValue.length <= 0) {
      Toast.info('请输入内容', 2);
      return;
    }
    dispatch({
      type: 'topics/editYourWrite',
      payload: {
        title,
        tab: selectedValue,
        content: textAreaValue.length <= 0 ? texAreaDefaultValue : textAreaValue,
      },
    });
  }
  render() {
    const { title, selectedValue, texAreaDefaultValue } = this.state;
    const { topics } = this.props;
    return (
      <WingBlank size="md">
        <Flex>
          <FlexItem>
            <span className={styles.selectTips}>
              请选择需要发布的板块：
            </span>
          </FlexItem>
          <FlexItem>
            <select
              defaultValue={selectedValue}
              onChange={this.selectorOnChange}
              className={styles.selector}
            >
              <option value="share">分享</option>
              <option value="ask">回答</option>
              <option value="job">招聘</option>
              <option value="dev">客户端测试</option>
            </select>
          </FlexItem>
        </Flex>
        <WhiteSpace />
        <div className={styles.flex}>
          <div className={styles.title}>
            <span>请输入标题:&nbsp;</span>
          </div>
          <div className={styles.input}>
            <input onChange={this.titleInputOnChange} value={title} placeholder="请输入10字以上" />
          </div>
        </div>
        <WhiteSpace />
        <div>
          <div className={styles.contentTips}>
            <span>请输入内容:&nbsp;</span>
          </div>
          <WhiteSpace />
          <TextareaItem
            defaultValue={texAreaDefaultValue}
            onChange={this.textAreaOnChange}
            className={styles.textArea}
            autoHeight
          />
        </div>
        <WhiteSpace />
        { topics ? <Button onClick={this.editWrite}>发表文章</Button> :
        <Button onClick={this.postWrite}>发表文章</Button> }
      </WingBlank>
    );
  }
}

export default Topics;
