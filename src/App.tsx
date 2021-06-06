import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { routes, MdWrapper, loadAMDModule } from '@culling/core';

const App = () => {
  const location = useLocation();
  useEffect(() => {
    loadAMDModule([`/api/modules?_=${Date.now()}`]).then(res => {
      console.log(res);
    });
  }, []);
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
                    <MdWrapper front={Item.front} data={Item.data} />
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
