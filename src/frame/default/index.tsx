import * as React from 'react';
import { Layout } from 'antd';
import { Route, Redirect, Switch } from 'react-router-dom';
import { History } from 'history';
import View_Sudoku from '../../route/sudoku';

const { Content } = Layout;

class Frame extends React.Component<FrameProps, {}> {
  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Content style={{ padding: 0, height: '100%' }}>
          <Route exact={true} path="/" render={() => <Redirect to="/sudoku" />} />
          <Switch>
            <Route path="/sudoku" component={View_Sudoku} />
            <Redirect from="*" to="/sudoku" />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

interface FrameProps {
  location: History.LocationState;
  match: {};
  history: {};
}

export default Frame;