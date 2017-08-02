import dva from 'dva';
import { browserHistory } from 'dva/router';
import { Toast } from 'antd-mobile';
import 'babel-polyfill';
import './index.css';
import './rem.less';

// 1. Initialize
const app = dva({
  history: browserHistory,
  onError(e) {
    Toast.info(`${e}`, 1);
  },
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/loginInfo'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
