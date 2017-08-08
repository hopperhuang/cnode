import React from 'react';
import { Flex, Button, WhiteSpace } from 'antd-mobile';
import { Link } from 'dva/router';
import { connect } from 'dva';
import styles from './NavBar.less';

const FlexItem = Flex.Item;
class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutHandler = this.logoutHandler.bind(this);
  }
  logoutHandler() {
    const { dispatch } = this.props;
    dispatch({ type: 'loginInfo/logout' });
  }
  render() {
    const { loginInfo } = this.props;
    const login = loginInfo.information;
    const loginAndLogOut = login ?
      <FlexItem><Button onClick={this.logoutHandler}>退出登录</Button></FlexItem> :
      <FlexItem><Link to="/login"><Button>登录</Button></Link></FlexItem>;
    const personalCenter = login ? <FlexItem><Link to={`/user/${login.loginname}`}><Button>个人中心</Button></Link></FlexItem> : '';
    const newTopics = login ? <FlexItem><Link to="/topics"><Button>新主题</Button></Link></FlexItem> : '';
    const messageCenter = login ? <div className={styles.unRead}><Link to="/message"><Button>未读消息：{login.unReadCount}</Button></Link></div> : '';
    return (
      <div>
        <Flex
          justify="between"
          className={styles.navBar}
        >
          <FlexItem><Link to="/"><Button>首页</Button></Link></FlexItem>
          {loginAndLogOut}
          {personalCenter}
          {newTopics}
        </Flex>
        <WhiteSpace />
        {messageCenter}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginInfo: state.loginInfo,
  };
}
export default connect(mapStateToProps)(NavBar);
