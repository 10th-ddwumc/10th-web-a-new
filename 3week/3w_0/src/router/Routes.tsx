import {
    Children,
    cloneElement,
    isValidElement,
    useMemo,
} from 'react';
import { useCurrentPath } from './useCurrentPath';
import type { RouteElement, RouteProps, RoutesProps } from './types';

const isRouteElement = (
    child: unknown
): child is RouteElement => {
    return isValidElement<RouteProps>(child) && 'path' in child.props;
};

export const Routes = ({ children }: RoutesProps) => {
    const currentPath = useCurrentPath();

    const activeRoute = useMemo(() => {
        const routes = Children.toArray(children).filter(isRouteElement);

        return routes.find((route) => route.props.path === currentPath);
    }, [children, currentPath]);

    if (!activeRoute) return <h1>404</h1>;

    return cloneElement(activeRoute);
};