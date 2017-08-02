import React from 'react';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: '',
    };
  }
  render() {
    return (
      <h1>这里是列表</h1>
    );
  }
}

export default List;
