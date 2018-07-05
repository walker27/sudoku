import * as React from 'react';
import { Route } from 'react-router-dom';
import Frame from './frame/default';
import styles from './App.module.css';

class App extends React.Component {
  render() {
    return (
      <div className={styles.App}>
        <Route path="/" component={Frame} />
      </div>
    );
  }
}

export default App;
