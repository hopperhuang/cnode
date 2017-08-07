import React from 'react';
import { ActivityIndicator } from 'antd-mobile';
import Topics from './topics';

class UpdateTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'topics/clearState',
    });
  }
  render() {
    const { topics, dispatch } = this.props;
    if (!topics.content) {
      return (
        <ActivityIndicator text="玩命加载中" />
      );
    }
    return (
      <Topics topics={topics} dispatch={dispatch} />
    );
  }
}

export default UpdateTopic;
