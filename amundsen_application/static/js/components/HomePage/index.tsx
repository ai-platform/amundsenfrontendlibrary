import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import BookmarkList from 'components/common/Bookmark/BookmarkList';
import PopularTables from 'components/common/PopularTables';
import { SearchAllReset } from 'ducks/search/types';
import { searchReset } from 'ducks/search/reducer';
import SearchBar from 'components/SearchPage/SearchBar';


export interface DispatchFromProps {
  searchReset: () => SearchAllReset;
}

export type HomePageProps = DispatchFromProps & RouteComponentProps<any>;

export class HomePage extends React.Component<HomePageProps> {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    this.props.searchReset();
  }

  render() {
    return (
      <div className="container home-page">
        <div className="row">
          <div className="col-xs-12 col-md-offset-1 col-md-10">
            <SearchBar />
            <div className="home-element-container">
              <BookmarkList />
            </div>
            <div className="home-element-container">
              <PopularTables />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ searchReset } , dispatch);
};

export default connect<DispatchFromProps>(null, mapDispatchToProps)(HomePage);