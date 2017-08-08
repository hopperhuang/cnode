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
          path: 'user/:loginname',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              // registerModel(app, require('./models/loginInfo'));
              registerModel(app, require('./models/user'));
              cb(null, require('./routes/user'));
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
        {
          path: 'topics',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/topics'));
              cb(null, require('./routes/topics'));
            }, 'topics');
          },
        },
        {
          path: 'update',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/topics'));
              cb(null, require('./routes/updateTopic'));
            }, 'topics');
          },
        },
        {
          path: 'message',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/message'));
              cb(null, require('./routes/message'));
            }, 'message');
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
