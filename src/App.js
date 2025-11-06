import React, { Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    HashRouter,
    Route,
    Routes,
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from 'react-router-dom'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import routes from './routes'
import Cookies from 'js-cookie'
import { MASTER, TOKEN, PROGRAM, getPermission } from './config'
import { alertPermissionDeny } from './components/Alert/Alert'

const DefaultLayout = React.lazy(() => import('./components/layout/Layout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Home = React.lazy(() => import('./views/Home/Home'))

export const ProtectedRoute = ({ children }) => {
    if (!Cookies.get(MASTER)) {
        return <Navigate replace to="/login" />
    }
    return children
}

const App = () => {
    const dispatch = useDispatch()
    const [os, setOs] = useState('')

    const createRoute = () => {
        const _router = routes
            .filter((f) => !!f.element)
            .map((route, idx) => {
                return {
                    key: idx,
                    path: route.path.slice(1),
                    name: route.name,
                    Component: route.element,
                    loader: async () => {
                        try {
                            const preload = route.loader ?? {}
                            const permission =
                                route.menu === 'home'
                                    ? {
                                          open: true,
                                          view: true,
                                          add: true,
                                          edit: true,
                                          delete: true,
                                          print: true,
                                          confirm: true,
                                      }
                                    : await getPermission(route.menu).catch((c) => {
                                          console.log(c)
                                          return false
                                      })
                            dispatch({ type: 'set', helmet: route.name })

                            console.log('permission for route', route.path, permission)
                            console.log('preload for route', route.menu, preload)
                            if (permission) {
                                if (!permission.open) {
                                    alertPermissionDeny(() => {
                                        // console.log('deny')
                                        // TODO:
                                        window.location.replace(`/${PROGRAM}/home`)
                                    })
                                    return { permission: false, ...preload }
                                }
                            }
                            return { permission, ...preload }
                        } catch (e) {
                            console.log('error loading route', e)
                            throw e
                        }
                    },
                    // errorElement: <Page404 />,
                    ErrorBoundary: (e) => {
                        console.log('error : => ', e)
                    },
                }
            })

        return createBrowserRouter(
            [
                {
                    path: 'login',
                    name: 'Login Page',
                    element: <Login loadedRoute={setLoadedRoute} />,
                },
                // TODO: Line
                // {
                //     path: "line-discount/register",
                //     name: "Line Register Page",
                //     element: <LineRegister />,
                // },
                {
                    path: '/',
                    name: 'Home',
                    element: (
                        <ProtectedRoute>
                            <DefaultLayout />
                        </ProtectedRoute>
                    ),
                    // children: _router,
                    children: (Cookies.get(MASTER) ? _router : []).concat({
                        key: 'p404',
                        path: '*',
                        element: <Page404 />,
                    }),
                    ErrorBoundary: (e) => {
                        console.log('err', e)
                    },
                    // errorElement: <Page404 />,
                },
            ],
            { basename: '/' + PROGRAM },
        )
    }

    const [loadedRoute, setLoadedRoute] = useState(false)
    const [routeState, setRouteState] = useState(createRoute())

    useEffect(() => {
        if (!loadedRoute) return
        const temp = createRoute()

        setRouteState(temp)
        setLoadedRoute(false)
    }, [loadedRoute, os])

    return (
        <React.Suspense
            fallback={
                <div className="pt-3 text-center">
                    <CSpinner color="primary" variant="grow" />
                </div>
            }
        >
            <RouterProvider router={routeState} />
        </React.Suspense>
    )
}

export default App
