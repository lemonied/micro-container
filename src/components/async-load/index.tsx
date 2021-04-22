import React, { Suspense, FC, lazy, useMemo } from 'react';
import { queryParse } from '../../helper/utils';
import qs from 'querystring';

const cacheModules = new Map<string, Promise<void>>();

export function loadScript(url: string): Promise<void> {
  if (cacheModules.has(url)) {
    return cacheModules.get(url) as Promise<void>;
  }
  const ret = new Promise<void>(((resolve, reject) => {
    const element = document.createElement('script');
    const split = url.split('?');
    const query = Object.assign({}, queryParse(split[1]), { _: Date.now() });
    element.src = `${split[0]}?${qs.stringify(query)}`;
    element.type = 'text/javascript';
    element.async = true;
    document.head.appendChild(element);
    element.onload = () => {
      resolve();
    };
    element.onerror = (err) => {
      document.head.removeChild(element);
      cacheModules.delete(url);
      reject(err);
    };
  }));
  cacheModules.set(url, ret);
  return ret;
}

export async function loadComponent(scope: string, module: string) {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__('default');

  const container = (window as any)[scope]; // or get the container somewhere else
  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  const factory = await (window as any)[scope].get(module);
  return factory();
}

interface AsyncErrorProps {
  scope: string;
  module: string;
}
const Error: FC<AsyncErrorProps> = (props) => {
  const { scope, module } = props;
  return (
    <>{scope} {module} loading failed</>
  );
};

interface AsyncComponentProps {
  remote?: string;
  scope: string;
  module: string;
  [prop: string]: any;
}
export const AsyncComponent: FC<AsyncComponentProps> = (props) => {
  const { remote, scope, module } = props;
  const C = useMemo(() => {
    if (typeof remote === 'undefined') {
      return lazy(() => {
        return loadComponent(scope, module).catch(() => {
          return Promise.resolve({ default: Error });
        });
      });
    }
    return lazy(() => {
      return loadScript(remote as string).then(() => {
        return loadComponent(scope, module);
      }).catch(() => {
        return Promise.resolve({ default: Error });
      });
    });
  }, []);

  return (
    <Suspense fallback={'loading...'}>
      <C { ...props } />
    </Suspense>
  );
};
