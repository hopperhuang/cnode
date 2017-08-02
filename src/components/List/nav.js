import React from 'react';
import { Flex, Button, WingBlank } from 'antd-mobile';
import { Link } from 'dva/router';
import styles from './nav.less';

const FlexItem = Flex.Item;
class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navs: [
        { content: '全部', queryString: 'tab=all' },
        { content: '精华', queryString: 'tab=good' },
        { content: '分享', queryString: 'tab=share' },
        { content: '问答', queryString: 'tab=ask' },
        { content: '招聘', queryString: 'tab=job' },
      ],
    };
  }
  render() {
    const { currentTab } = this.props;
    // 正则表达式用于判断queryString是否匹配。
    const regExp = /^tab=(.+)$/;
    const { navs } = this.state;
    // 循环数组，生成组件。
    const navTabs = navs.map((nav) => {
      const matchResult = regExp.exec(nav.queryString)[1];
      const ifMatch = currentTab === matchResult;
      return (<FlexItem key={nav.queryString}>
        <Link to={`/?${nav.queryString}`}>
          <Button
            className={ifMatch ? styles.current : ''}
          >
            {nav.content}
          </Button>
        </Link>
      </FlexItem>);
    });
    return (
      <WingBlank size="sm">
        <Flex
          justify="between"
          className={styles.nav}
        >
          {navTabs}
        </Flex>
      </WingBlank>
    );
  }
}
export default Nav;
