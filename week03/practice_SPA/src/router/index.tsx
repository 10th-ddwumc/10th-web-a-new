import { useEffect, useState } from "react";
import type { ReactElement, ReactNode } from "react";

interface LinkProps {
  to: string;
  children: ReactNode;
}

export const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState({}, "", to);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <a href={to} onClick={handleClick} style={{ textDecoration: "none" }}>
      {children}
    </a>
  );
};

interface RouteProps {
  path: string;
  component: React.ComponentType;
}

export const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};

interface RoutesProps {
  children: ReactElement<RouteProps>[] | ReactElement<RouteProps>;
}

export const Routes = ({ children }: RoutesProps) => {
  const [path, setPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handleChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleChange);
    return () => window.removeEventListener("popstate", handleChange);
  }, []);

  const routeArray = Array.isArray(children) ? children : [children];

  const match = routeArray.find((child) => child.props.path === path);

  return match ?? <h1>페이지 없음</h1>;
};
