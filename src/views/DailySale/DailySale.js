import React, { useEffect, useState, useRef } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Image, Avatar, Tag, Row } from 'antd'
import {
    LoadingOutlined,
    UserOutlined,
    LockOutlined,
    CodeOutlined,
    ShopOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseCircleTwoTone,
    CheckCircleTwoTone,
    CrownTwoTone,
    CopyOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    PrinterOutlined,
    SearchOutlined,
    SendOutlined,
} from '@ant-design/icons'

import { alertConfirm } from '../../components/Alert/Alert'
import moment from 'moment'
import numeral from 'numeral'
import Btn from '../../components/Button/BtnComponent'
import { getUserProfile } from '../../service/ServiceLogin'
import TableComponentForwardRef from '../../components/Table/TableComponentForwardRef'
import { ServiceUser } from '../../service/ServiceUser'
import { ServiceDailySale } from '../../service/ServiceDailySale'
import PrintDailySale from './PrintDailySale'
const DailySale = () => {
    const history = useNavigate()
    const tableRef = useRef(null)
    const { getDailySale, getDailySaleDetail } = ServiceDailySale()

    const [Data, setData] = useState([])
    const [TotalPage, setTotalPage] = useState(0)
    const [LoadingTable, setLoadingTable] = useState(false)
    const [openModalAddMenu, setOpenModalAddMenu] = useState(false)

    const searchOption = [
        { value: 'order_id', label: 'หมายเลขคำสั่งซื้อ', placeholder: 'ค้นหา หมายเลขคำสั่งซื้อ' },
        { value: 'order_sn', label: 'รหัสพนักงาน', placeholder: 'ค้นหา รหัสพนักงาน' },
    ]

    const columns = [
        {
            title: () => <label style={{ fontWeight: 'bold' }}>{'ส่งออก'}</label>,
            dataIndex: 'is_sent_acct',
            key: 'is_sent_acct',
            width: 80,
            align: 'center',
            render: (text, record) =>
                record.is_sent_acct === true ? (
                    // <Tag
                    //     color="success"
                    //     style={{ width: '100%', textAlign: 'center', fontSize: '15px' }}
                    // >
                    //     ส่งออกแล้ว
                    // </Tag>
                    <CheckCircleOutlined
                        style={{ display: 'inline-grid', color: 'green', fontSize: '16px' }}
                    />
                ) : (
                    ''
                ),
        },
        {
            title: () => <label style={{ fontWeight: 'bold' }}>{'เลขที่บัญชี'}</label>,
            dataIndex: 'acc_no',
            key: 'acc_no',
            width: 120,
        },
        {
            title: () => <label style={{ fontWeight: 'bold' }}>{'เต็มรูปแบบ'}</label>,
            dataIndex: 'full_tax_invoice',
            key: 'full_tax_invoice',
            width: 120,
            align: 'center',
        },
        {
            title: () => <label style={{ fontWeight: 'bold' }}>{'เลขที่ใบกำกับภาษี'}</label>,
            dataIndex: 'order_id',
            key: 'order_id',
            width: 150,
        },
        {
            title: () => <label style={{ fontWeight: 'bold' }}>{'หมายเลขคำสั่งซื้อ'}</label>,
            dataIndex: 'order_no',
            key: 'order_no',
            width: 150,
        },

        {
            title: () => <label style={{ fontWeight: 'bold' }}>{'วันที่ชำระเงิน'}</label>,
            dataIndex: 'escrow_date',
            key: 'escrow_date',
            width: 150,
            align: 'center',
            render: (text, record) => (text ? moment.utc(text).format('DD/MM/YYYY HH:mm') : ''),
        },
        {
            title: <b>มูลค่าก่อนภาษี</b>,
            dataIndex: 'before_vat',
            key: 'before_vat',
            align: 'right',
            width: 120,
            render: (txt) => <span>{numeral(txt).format('0,00.00')}</span>,
        },
        {
            title: <b>ภาษี</b>,
            dataIndex: 'vat',
            key: 'vat',
            align: 'right',
            width: 100,
            render: (txt) => <span>{numeral(txt).format('0,00.00')}</span>,
        },
        {
            title: <b>ยอดรวม</b>,
            dataIndex: 'total_amount',
            key: 'total_amount',
            align: 'right',
            width: 100,
            render: (txt) => <span>{numeral(txt).format('0,00.00')}</span>,
        },
    ]

    const items = [
        {
            label: 'ส่งบัญชี',
            key: 'send-acc',
            icon: <SendOutlined />,
        },

        {
            label: 'รายละเอียด',
            key: 'view',
            icon: <SearchOutlined />,
        },
        {
            label: 'พิมพ์',
            key: 'print',
            icon: <PrinterOutlined />,
        },
    ]

    useEffect(() => {
        admin()
    }, [])

    const admin = async () => {
        const data = await getUserProfile()
        if (data === undefined) history('/')
        if (data?.user_level !== 'A') {
            history('/')
        }
    }

    const loadData = async (type, search, offset, limit) => {
        setLoadingTable(true)
        const data = await getDailySale({
            offset: offset,
            limit: limit,
            search: search,
            type_search: type,
        })

        console.log('dataaaa ', data)
        if (data !== undefined) {
            setData(data.result)
            setTotalPage(data.total)
        }

        setLoadingTable(false)
    }

    const handleMenuClick = (record, key) => {
        switch (key) {
            case 'view':
                break
            case 'print':
                PrintDailySale(record)
                break
            default:
        }
    }

    const refresh = async () => {
        tableRef.current.refresh()
    }

    return (
        <Card>
            <TableComponentForwardRef
                ref={tableRef}
                searchList={searchOption}
                rowKey={'order_id'}
                className={'daily-sale-table'}
                dataSource={Data}
                columns={columns}
                tableLayout={'fixed'}
                onSearch={loadData}
                total={TotalPage}
                isLoading={LoadingTable}
                style={{ marginTop: 10 }}
                menuItems={items}
                handleMenuClick={handleMenuClick}
                selectStyle={{
                    width: '150px',
                }}
                MenuBtn={() => {
                    return (
                        <Row>
                            <Btn.Add
                                disabled={false}
                                style={{ marginLeft: 10 }}
                                onClick={() => history(`/user/add`)}
                            >
                                ดึงข้อมูล
                            </Btn.Add>
                            <Btn.Add
                                disabled={false}
                                style={{ marginLeft: 10 }}
                                onClick={() => history(`/user/add`)}
                            >
                                ส่งบัญชี
                            </Btn.Add>
                        </Row>
                    )
                }}
            />
        </Card>
    )
}

export default DailySale
