import React from 'react';
import { Router } from 'dva/router';
import PropTypes from 'prop-types';
import IndexPage from './routes/IndexPage';
import TopicWrapper from './routes/topic';

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
};
const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: IndexPage,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/list'));
          cb(null, { component: require('./routes/List') });
        }, 'IndexPageList');
      },
      childRoutes: [
        {
          path: 'login',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/login'));
            }, 'login');
          },
        },
        {
          path: 'personalCenter',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/loginInfo'));
              cb(null, require('./routes/personalCenter'));
            }, 'personalCenter');
          },
        },
        {
          path: 'topic/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/topic'));
              cb(null, require('./routes/topic'));
            }, 'topic');
          },
        },
      ],
    },
  ];

  return <Router history={history} routes={routes} />;
};
Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;
