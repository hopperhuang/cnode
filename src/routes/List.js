import { connect } from 'dva';
import List from '../components/List/List';

function mapStateToProps(state) {
  return {
    list: state.list,
  };
}
const IndexPageList = connect(mapStateToProps)(List);
export default IndexPageList;
