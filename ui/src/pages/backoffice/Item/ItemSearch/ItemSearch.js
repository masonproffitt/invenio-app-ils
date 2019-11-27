import React, {Component} from 'react';
import {Grid, Item, Header, Container} from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import {getSearchConfig} from '@config';
import {
  Error as IlsError,
  SearchBar as ItemsSearchBar,
} from '@components';
import {item as itemApi} from '@api';
import {ExportReactSearchKitResults, NewButton} from '../../components';
import {BackOfficeRoutes} from '@routes/urls';
import {ItemListEntry} from './components';
import {SearchControls} from '@components/SearchControls';
import history from '@history';
import {SearchEmptyResults, SearchAggregationsCards, SearchFooter}
  from "../../../../components/SearchControls/components/";

export class ItemSearch extends Component {
  searchApi = new InvenioSearchApi({
    url: itemApi.searchBaseURL,
    withCredentials: true,
  });
  searchConfig = getSearchConfig('items');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    return (
      <ItemsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder={'Search for items'}
      />
    );
  };

  renderError = error => {
    return <IlsError error={error}/>;
  };

  renderItemList = results => {
    const entries = results.map(res => (
      <ItemListEntry item={res} key={res.id}/>
    ));
    return <Item.Group divided
                       className={'bo-item-search'}>{entries}</Item.Group>;
  };

  renderEmptyResultsExtra = () => {
    return (
      <NewButton text={'Add item'} to={BackOfficeRoutes.itemCreate}/>
    );
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi} history={history}>

          <Container fluid className="spaced">
              <SearchBar renderElement={this.renderSearchBar}/>
          </Container>

          <Container fluid className="bo-search-body">
          <Grid>
          <Grid.Row columns={2}>
            <ResultsLoader>
              <Grid.Column width={3} className={'search-aggregations'}>
                <Header content={'Filter by'}/>
                <SearchAggregationsCards modelName={'items'}/>
              </Grid.Column>
              <Grid.Column width={13}>
                <Grid columns={2}>
                  <Grid.Column width={8}>
                    <NewButton
                      text={'Add item'}
                      to={BackOfficeRoutes.itemCreate}
                    />
                  </Grid.Column>
                  <Grid.Column width={8} textAlign={'right'}>
                    <ExportReactSearchKitResults
                      exportBaseUrl={itemApi.searchBaseURL}
                    />
                  </Grid.Column>
                </Grid>
                <SearchEmptyResults extras={this.renderEmptyResultsExtra}/>
                <Error renderElement={this.renderError}/>
                <SearchControls modelName={'items'}/>
                <ResultsList renderElement={this.renderItemList}/>
                <SearchFooter/>
              </Grid.Column>
            </ResultsLoader>
          </Grid.Row>
          </Grid>
          </Container>
      </ReactSearchKit>
    );
  }
}
