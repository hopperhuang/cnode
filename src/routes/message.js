import { connect } from 'dva';
import Message from '../components/Message/message';

function mapStateToProps(state) {
  return {
    message: state.message,
  };
}

export default connect(mapStateToProps)(Message);
