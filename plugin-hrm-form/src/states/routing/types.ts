// Action types
export const CHANGE_ROUTE = 'CHANGE_ROUTE';

// The different routes we have in our app
export type AppRoutes =
  // TODO: enum the possible subroutes on each route
  | { route: 'tabbed-forms' }
  | { route: 'new-case'; subroute?: 'add-note' | 'view-note' }
  | { route: 'select-call-type' };

type ChangeRouteAction = {
  type: typeof CHANGE_ROUTE;
  routing: AppRoutes;
  taskId: string;
};

export type RoutingActionType = ChangeRouteAction;
