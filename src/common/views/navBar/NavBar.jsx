import React, { Component, Fragment } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import nav from '../navRoutes.js';
import { BrowserRouter as Router } from 'react-router-dom';
import styles from './navBar.css';
import { connect } from 'react-redux';
import { toggleLinks } from '../../reduxModules/viewModule.js';
import sharedStyles from '../sharedCss/sharedCss.css';


class NavBar extends Component {


    render() {
    const { toggleLinks } = this.props;
    const { showNav } = this.props.view;
//    console.log(showFlex);
        const links = nav.routes.map (e =>
            <Link to = { e.path } key = { e.path } onClick = {toggleLinks}>
                {e.title}</Link>
        )
        return (
            <div className='nav-wrapper'>
                <nav className='nav-bar max-width'>
                    <a className='menu-icon' onClick = {toggleLinks}>
                        <img src='/menu.svg'/> </a>
                    <span className='links' style={{display:showNav}}>
                        { links }</span>
                </nav>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        view: state.view
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleLinks: () => dispatch(toggleLinks())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
