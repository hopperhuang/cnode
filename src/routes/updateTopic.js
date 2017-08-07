import { connect } from 'dva';
import UpdateTopic from '../components/topics/updateTopic';

function mapStateToProps(state) {
  return {
    topics: state.topics,
  };
}

export default connect(mapStateToProps)(UpdateTopic);
