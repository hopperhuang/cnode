import { connect } from 'dva';
import User from '../components/User/User';

function mapStateToProps(state) {
  return {
    userInformation: state.user,
  };
}

export default connect(mapStateToProps)(User);
