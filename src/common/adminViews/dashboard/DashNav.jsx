import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Switch } from 'react-router-dom';
import { fetchData } from '../../reduxModules/fetchThunk';
import { loginAction } from '../../reduxModules/authModule';
import { toggleDashSideNav } from '../../reduxModules/viewModule';

/*
  Mobile
    menu.svg appears
      for opening up side nav
  Desktop
    menu.svg gone
*/

class DashNav extends Component {
  logout = () => {
    this.props.fetchData('/api/auth/logout',this.props.loginAction)
  }

  render() {
  const { toggle } = this.props;
  const { lstatus } = this.props.auth;
    return (
      <nav className = 'dash-topnav'>
        <a className='dtn-menu'> 
          <img src='/dashMenu.svg' onClick = { toggle } /> 
        </a>

        <Link to = '/'> Home </Link>
        { lstatus.user ?
        <Link to = '/admin' onClick = { this.logout }> Log Out </Link>
        : null }
      </nav> 
    )
  }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url, cb) => dispatch(fetchData(url, cb)),
        loginAction: (lstatus) => dispatch(loginAction(lstatus)),
        toggle: () => dispatch(toggleDashSideNav()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashNav);
