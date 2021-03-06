import * as React from 'react';
import * as Avatar from 'react-avatar';
import { RouteComponentProps } from 'react-router';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AppConfig from 'config/config';
import { LinkConfig } from 'config/config-types';
import { GlobalState } from 'ducks/rootReducer';
import { logClick } from 'ducks/utilMethods';
import { Dropdown, MenuItem } from 'react-bootstrap';

import { LoggedInUser } from 'interfaces';

import { feedbackEnabled, indexUsersEnabled } from 'config/config-utils';

import Feedback from 'components/Feedback';
import SearchBar from 'components/common/SearchBar';

import './styles.scss';

// Props
interface StateFromProps {
  loggedInUser: LoggedInUser;
}

export type NavBarProps = StateFromProps & RouteComponentProps<{}>;

export class NavBar extends React.Component<NavBarProps> {
  constructor(props) {
    super(props);
  }

  generateNavLinks(navLinks: LinkConfig[]) {
    return navLinks.map((link, index) => {
      if (link.use_router) {
        return <NavLink className="title-3 border-bottom-white" key={index} to={link.href} target={link.target}
                        onClick={logClick}>{link.label}</NavLink>
      }
      return <a className="title-3 border-bottom-white" key={index} href={link.href} target={link.target}
                onClick={logClick}>{link.label}</a>
    });
  }

  renderSearchBar = () => {
    if (this.props.location.pathname !== "/explore/") {
      return (
        <div className="search-bar">
          <SearchBar size="small" />
        </div>
      )
    }
    return null;
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="nav-bar">
            <div id="nav-bar-left" className="nav-bar-left">
              <Link to={`/explore/`}>
                {
                  AppConfig.logoPath &&
                  <img id="logo-icon" className="logo-icon" src={AppConfig.logoPath} />
                }
                <span className="title-3">EXPLORE</span>
              </Link>
            </div>
            { this.renderSearchBar() }
            <div id="nav-bar-right" className="ml-auto nav-bar-right">
              {this.generateNavLinks(AppConfig.navLinks)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    loggedInUser: state.user.loggedInUser,
  }
};

export default connect<StateFromProps>(mapStateToProps)(withRouter(NavBar));
