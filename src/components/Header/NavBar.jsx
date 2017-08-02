import React from 'react';
import { Flex, Button } from 'antd-mobile';
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
    const personalCenter = login ? <FlexItem><Link to="/personalCenter"><Button>个人中心</Button></Link></FlexItem> : '';
    return (
      <Flex
        justify="between"
        className={styles.navBar}
      >
        <FlexItem><Link to="/"><Button>首页</Button></Link></FlexItem>
        {loginAndLogOut}
        {personalCenter}
      </Flex>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginInfo: state.loginInfo,
  };
}
export default connect(mapStateToProps)(NavBar);
