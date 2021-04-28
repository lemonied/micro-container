import React  from 'react';
import { AsyncComponent } from './components/async-load';
import { MdWrapper } from '@/components/md-wrapper';
import { Route, Switch, useLocation } from 'react-router-dom';

const routes = require('./.temp/temporary.js');

const App = () => {
  const location = useLocation();
  return (
    <>
      <div>Hello World</div>
      <AsyncComponent
        remote={'//localhost:3002/remoteEntry.js'}
        scope={'app1'}
        module={'./App'}
      />
      <Switch location={location}>
        {
          routes.map((Item: any) => {
            return (
              <Route
                exact={Item.exact}
                path={Item.path}
                key={Item.path}
                render={props => {
                  return (
                    <MdWrapper>
                      <Item.Component />
                    </MdWrapper>
                  );
                }}
              />
            );
          })
        }
      </Switch>
    </>
  );
};

export default App;
