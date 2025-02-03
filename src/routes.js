import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Home = React.lazy(() => import('./views/Home/Home'))

const routes = [
    { path: '/', name: 'Home', element: Home, exact: true },
    { path: '/dashboard', name: 'Dashboard', element: Dashboard, exact: true },
]

export default routes
