import React, { useState, useEffect, useRef, use } from 'react'
import { Card, Tag, Row, Col } from 'antd'
import TableComponentForwardRef from '../../components/Table/TableComponentForwardRef'

// import SelectComponent from '../ReuseComponent/SelectorIndex'
import { createMenuItemFnc, EMenuType } from '../../components/Table/CreateTableMenu'
import { 
    alertConfirm, 
    alertWarning, 
    alertSuccess
 } from '../../components/Alert/Alert'

import { useNavigate } from 'react-router-dom'
import Btn from '../../components/Button/BtnComponent'
import { Icons } from '../../components/icons/AntIcons'

import { ServiceRepair } from '../../service/ServiceRepair'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { DATE_FORMAT } from '../../config'
import numeral from 'numeral'

// Extend dayjs with UTC plugin
dayjs.extend(utc)

const RepairTable = ({ tabFilter = {}, tabType = '', setBadge = () => {} }) => {
    const navigate = useNavigate()
    const { getAllRepairOrders } = ServiceRepair()

    const tableRef = useRef()
    const [dataTable, setDataTable] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    // const [PrintCNModalVisible, setPrintCNModalVisible] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState({})

    const handleLoadData = async (typeSearch, textSearch, page, pageSize, filter) => {
        try {
            setLoading(true)
            const data = await getAllRepairOrders({
                limit: pageSize,
                offset: page,
                search: textSearch,
                type_search: typeSearch,
                filter: { ...filter, ...tabFilter },
            })
            console.log('data repair : ', data)
            if (data) {
                setDataTable(data.result.map((item, i) => ({ ...item, key: i })))
                setBadge((state) => ({ ...state, [tabType]: data.total }))
            }

            setLoading(false)
        } catch (e) {
            console.error(e)
        }
    }

    const columns = [
        {
            title: <b>สถานะ</b>,
            dataIndex: 'status',
            width: 90,
            align: 'center',
            fixed: 'left',
            render: (text) => {
                if (text === 'PENDING') return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Tag style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 0
                        }} color="yellow">รอดำเนินการ</Tag>
                    </div>
                )
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        {text}
                    </div>
                )
            },
        },
        {
            title: <b>อนุมัติ</b>,
            dataIndex: 'approval',
            width: 60,
            align: 'center',
            fixed: 'left',
            render: (text, record) => (text === "WAITING" ? <Icons.IconIsActive /> : <Icons.IconClockCircle />),
        },
        {
            title: <b>เลขที่ซ่อม</b>,
            width: 80,
            dataIndex: 'repair_no',
            align: 'center',
            fixed: 'left',
        },
        {
            title: <b>วันที่</b>,
            dataIndex: 'date',
            align: 'center',
            width: 100,
            fixed: 'left',
            render: (text) => (text ? dayjs(text).utc().format(DATE_FORMAT.DISPLAY) : ''),
        },
        {
            title: <b>ประเภทอุปกรณ์</b>,
            dataIndex: 'vehicle_name',
            width: 120,
            align: 'center',
            fixed: 'left',
        },
        {
            title: <b>รหัสทรัพย์สิน</b>,
            dataIndex: 'asset_no',
            width: 240,
            align: 'left',
            fixed: 'left',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <span 
                    title={text}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: <b>รายละเอียดทรัพย์สิน</b>,
            dataIndex: 'asset_name',
            width: 240,
            align: 'left',
            fixed: 'left',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <span 
                    title={text}
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: <b>ผู้ประสานงาน/เบอร์ติดต่อ</b>,
            dataIndex: 'contact_name',
            width: 260,
            align: 'center',
        },
        {
            title: <b>ผู้อนุมัติ</b>,
            dataIndex: 'approved',
            width: 180,
            align: 'center',
        },
        {
            title: <b>ผู้บันทึก</b>,
            dataIndex: 'created_by',
            width: 120,
            align: 'center',
        },
        {
            title: <b>วันที่บันทึก</b>,
            dataIndex: 'created_date',
            width: 120,
            render: (text) => (text ? dayjs(text).utc().format(DATE_FORMAT.DISPLAY) : ''),
            align: 'center',
        },
        {
            title: <b>ผู้แก้ไข</b>,
            dataIndex: 'edit_by',
            width: 120,
            align: 'center',
        },
        {
            title: <b>วันที่แก้ไข</b>,
            dataIndex: 'edit_date',
            width: 120,
            render: (text) => (text ? dayjs(text).utc().format(DATE_FORMAT.DISPLAY) : ''),
            align: 'center',
        }
    ]

    // const handleDeleteCN = (record) => {
    //     const params = {    
    //         docno: record.docno,
    //         rtv_id: record.pono,
    //     }

    //      alertConfirm({
    //              alert_Title: `ต้องการลบใบลดหนี้ ${record.docno} ใช่หรือไม่?`,
    //                onConfirm: async () => {
    //                   return deleteCN(params)
    //             },
    //           success: {
    //                   success_title: 'ลบใบลดหนี้สำเร็จ',
    //                  callback: () => handleLoadData(),
    //                },
    //   })
    // }

    const _menuItems = createMenuItemFnc([
        {
            type: EMenuType.EDIT,
            action: (record) => {
                navigate(`/n/${EMenuType.EDIT}/${record.refno}?docno=${record.docno}`)
            },
            disabled: (record) => true,  //ปิดไม่ให้แก้ไข
            // disabled: (record) => record.status === 'C' || record.confirm,
        },
        {
            type: EMenuType.VIEW,
            action: (record) => {
                console.log('record:', record)
                navigate(`/cn/${EMenuType.VIEW}/${record.docno}?customer_id=${record.customer_id}&company=${record.company}`)
            },
        },
        {
            type: EMenuType.PRINT,
            action: (record) => {
                setSelectedRecord(record)
                setPrintCNModalVisible(true)
            },
        },
        {
            type: EMenuType.DIVIDER,
        },
        {
            type: EMenuType.DELETE,
            action: (record) => {
                handleDeleteCN(record)
            },
            disabled: (record) => record.status === 'C' || record.confirm || record.shoeadda_docno !== '',
        },
    ])

    return (
        <Card style={{ borderRadius: 3 }}>
            <TableComponentForwardRef
                ref={tableRef}
                MenuBtn={() => (
                    <Row style={{ marginLeft: '3px' }}>
                        <Btn.Add
                            onClick={() => {
                                navigate(`/repair/${EMenuType.ADD}`)
                            }}
                        />
                    </Row>
                )}
                loading={loading}
                className={'NTables_' + tabType}
                total={total}
                onSearch={handleLoadData}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                className="n-tableComponent"
                searchList={[
                    {
                        label: 'เลขที่ใบแจ้งซ่อม',
                        value: 'repair_no',
                    },
                    {
                        label: 'วันที่แจ้งซ่อม',
                        value: 'date',
                    },
                ]}
                {..._menuItems}
                dataSource={dataTable}
                columns={columns}
            />
            {/* <PrintCNModal
                visible={{ get: PrintCNModalVisible, set: setPrintCNModalVisible }}
                refresh={handleLoadData}
                record={selectedRecord}
            /> */}
        </Card>
    )
}

export default RepairTable
