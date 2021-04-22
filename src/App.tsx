import React  from 'react';
import { AsyncComponent } from './components/async-load';

const App = () => {
  return (
    <>
      <div>Hello World</div>
      <AsyncComponent
        remote={'//localhost:3002/remoteEntry.js'}
        scope={'app1'}
        module={'./App'}
      />
    </>
  );
};

export default App;
