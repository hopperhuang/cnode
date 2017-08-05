import { connect } from 'dva';
import Topic from '../components/topic/topic';

function mapStateToProps(state) {
  return {
    topic: state.topic,
  };
}
export default connect(mapStateToProps)(Topic);
