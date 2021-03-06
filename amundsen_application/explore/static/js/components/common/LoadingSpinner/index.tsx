import * as React from 'react';
import './styles.scss';

class LoadingSpinner extends React.Component {

  render() {
    return (
      <img src='/explore/static/images/loading_spinner.gif'
           alt="loading..."
           className="loading-spinner"/>
    );
  }
}

export default LoadingSpinner;
