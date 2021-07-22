import React from 'react'
import { Route, Switch } from 'react-router-dom'

import NotFound from '../pages/NotFound.page'

export default function Routes({ routes }) {
  const renderRoutes = routes.map((route) => {
    const { path, component } = route;
    return <Route path={path} component={component} key={path} exact />
  })

  return (
    <Switch>
      {renderRoutes}
      <Route component={NotFound} />
    </Switch>
  )
}
