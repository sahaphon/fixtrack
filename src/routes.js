import React from 'react'

const Home = React.lazy(() => import('./views/Home/Home'))
const User = React.lazy(() => import('./views/User/User'))
const UserDetail = React.lazy(() => import('./views/User/UserDetail'))
const FileSystem = React.lazy(() => import('./views/FileSystem/FileSystem'))
const FileSystemDetail = React.lazy(() => import('./views/FileSystem/FileSystemDetail'))

const routes = [
  { path: '/', name: 'Home', element: Home, menu: 'home' },
  { path: '/user', name: 'ข้อมูลผู้ใช้งาน', element: User, exact: true, menu: 'M001' },
  {
    path: '/user/add',
    name: 'เพิ่มข้อมูลผู้ใช้งาน',
    element: UserDetail,
    exact: true,
    menu: 'M001',
    typeForm: 'add',
  },
  {
    path: '/user/edit',
    name: 'แก้ไขข้อมูลผู้ใช้งาน',
    element: UserDetail,
    exact: true,
    menu: 'M001',
    typeForm: 'edit',
  },
  {
    path: '/user/copy',
    name: 'เพิ่มข้อมูลผู้ใช้งาน',
    element: UserDetail,
    exact: true,
    menu: 'M001',
    typeForm: 'view',
  },
  {
    path: '/user/view',
    name: 'รายละเอียดข้อมูลผู้ใช้งาน',
    element: UserDetail,
    exact: true,
    menu: 'M001',
    typeForm: 'view',
  },
  { path: '/menu', name: 'ข้อมูลระบบงาน', element: FileSystem, exact: true, menu: 'M001' },
  {
    path: '/menu/add',
    name: 'เพิ่มข้อมูลระบบงาน',
    element: FileSystemDetail,
    exact: true,
    menu: 'M001',
    typeForm: 'add',
  },
  {
    path: '/menu/edit',
    name: 'แก้ไขข้อมูลระบบงาน',
    element: FileSystemDetail,
    exact: true,
    menu: 'M001',
    typeForm: 'edit',
  },
  {
    path: '/menu/view',
    name: 'รายละเอียดข้อมูลระบบงาน',
    element: FileSystemDetail,
    exact: true,
    menu: 'M001',
    typeForm: 'view',
  }
]

export default routes
