import React  from 'react';
import { MdWrapper } from '@culling/core/lib/components';
import { Route, Switch, useLocation } from 'react-router-dom';
import { routes } from '@culling/core';

const App = () => {
  const location = useLocation();
  return (
    <>
      <Switch location={location}>
        {
          routes.map((Item) => {
            return (
              <Route
                exact={Item.exact}
                path={Item.path}
                key={Item.path}
                render={props => {
                  return (
                    <MdWrapper data={Item.data} />
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
