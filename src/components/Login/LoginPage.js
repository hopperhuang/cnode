import React from 'react';
import { WingBlank, WhiteSpace, InputItem, Button } from 'antd-mobile';
import styles from './LoginPage.less';
// import request from '../../utils/request';
//
// request('/api/topics');
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accesstoken: '',
    };
    this.inputOnChangeHandler = this.inputOnChangeHandler.bind(this);
    this.buttonOnClickHandler = this.buttonOnClickHandler.bind(this);
  }
  inputOnChangeHandler(value) {
    this.setState({
      accesstoken: value,
    });
  }
  buttonOnClickHandler() {
    const { dispatch } = this.props;
    const { accesstoken } = this.state;
    dispatch({
      type: 'loginInfo/login',
      payload: {
        accesstoken,
      },
    });
  }
  render() {
    const { accesstoken } = this.state;
    return (
      <div className={styles.LoginPage}>
        <WingBlank>
          <WhiteSpace />
          <div>请输入你的accesstoken然后点击提交</div>
          <WhiteSpace />
          <InputItem
            placeholder="auto focus in Alipay client"
            autoFocus
            value={accesstoken}
            onChange={this.inputOnChangeHandler}
          >
          token
        </InputItem>
          <WhiteSpace />
          <Button onClick={this.buttonOnClickHandler}>提交</Button>
        </WingBlank>
      </div>
    );
  }
}
export default LoginPage;
