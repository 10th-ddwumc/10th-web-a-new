import { Children, cloneElement, FC, isValidElement, useMemo, useState, useEffect } from 'react';
import type { MouseEvent } from 'react';

interface LinkProps {
  to: string;
  children: React.ReactNode;
}

interface RouteProps {
  path: string;
  component: React.ComponentType;
}

interface RoutesProps {
  children: React.ReactNode;
}

const getCurrentPath = () => window.location.pathname;

const navigateTo = (to: string) => {
  history.pushState(null, '', to);
  window.dispatchEvent(new Event('pushstate'));
};

const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const handler = () => setPath(getCurrentPath());
    window.addEventListener('pushstate', handler);
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('pushstate', handler);
      window.removeEventListener('popstate', handler);
    };
  }, []);

  return path;
};

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (getCurrentPath() === to) return;
    navigateTo(to);
  };

  return <a href={to} onClick={handleClick}>{children}</a>;
};

export const Route = ({ component: Component }: RouteProps) => <Component />;

const isRouteElement = (child: unknown): child is React.ReactElement<RouteProps> =>
  isValidElement(child) && 'path' in (child.props as object);

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};