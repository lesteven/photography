import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { updateScreenSize } from './reduxModules/viewModule';
import routesOptions from './routes.js';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import { fetchData, postData } from './reduxModules/fetchThunk';
import styles from './views/sharedCss/sharedCss.css';
import { loginAction } from './reduxModules/authModule';


class App extends Component {
  componentDidMount() {
    // check if user is logged in
    const { fetchData, loginAction } = this.props;
    fetchData('/api/auth/log', loginAction);
  }

  render() {
      // mapped out client routes for reactRouter
      const reactRoutes = routesOptions.routes.map (e =>
          <Route exact = { e.exact } path = { e.path } 
              component = { e.component } key = { e.path} />
      )
      return (
          <Fragment>
            <Switch>
                { reactRoutes }
            </Switch>
          </Fragment>
      )
  }
}



const mapStateToProps = (state) => {
    return {
        view:state.view
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
      getScreenSize:(size) => dispatch(updateScreenSize(size)),
      loginAction: (status) => dispatch(loginAction(status)),
      fetchData: (url, cb) => dispatch(fetchData(url,cb)),
    }
}

// use withRouter to pass location to App
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));


