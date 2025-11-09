import React, { useState, useEffect, useRef, use } from 'react'
import { Card, Tag, Row, Col } from 'antd'
import TableComponentForwardRef from '../../components/Table/TableComponentForwardRef'

import SelectComponent from '../ReuseComponent/SelectorIndex'
import { createMenuItemFnc, EMenuType } from '../../components/Table/CreateTableMenu'
import { 
    alertConfirm, 
    alertWarning, 
    alertSuccess
 } from '../../components/Alert/Alert'

import { useNavigate } from 'react-router-dom'
import Btn from '../../components/Button/BtnComponent'
import { Icons } from '../../components/icons/AntIcons'

import { ServiceCN } from '../../service/ServiceCN'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '../../config'
import numeral from 'numeral'

// import { bufferToPDF } from '../../utilities/BufferToPDF'

const CNTable = ({ tabFilter = {}, tabType = '', setBadge = () => {} }) => {
    const navigate = useNavigate()
    const { getAllCN, deleteCN } = ServiceCN()

    const tableRef = useRef()
    const [dataTable, setDataTable] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    const [PrintCNModalVisible, setPrintCNModalVisible] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState({})

    const handleLoadData = async (typeSearch, textSearch, page, pageSize, filter) => {
        try {
            setLoading(true)
            const data = await getAllCN({
                limit: pageSize,
                offset: page,
                search: textSearch,
                type_search: typeSearch,
                filter: { ...filter, ...tabFilter },
            })
            console.log('data cn table : ', data)
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
            width: 60,
            align: 'center',
            fixed: 'left',
            render: (text) => {
                if (text === 'C') return <Tag color="red">ยกเลิก</Tag>
                return text
            },
        },
        {
            title: <b>โอนข้อมูล</b>,
            width: 60,
            dataIndex: 'shoeadda_docno',
            align: 'center',
            fixed: 'left',
            render: (text, record) => (text ? <Icons.IconIsActive /> : <Icons.IconNonActive />),
        },
        {
            title: <b>บัญชี</b>,
            dataIndex: 'confirm',
            align: 'center',
            width: 60,
            fixed: 'left',
            render: (text, record) => (text ? <Icons.IconIsActive /> : <Icons.IconNonActive />),
        },
        {
            title: <b>Type</b>,
            dataIndex: 'company',
            width: 60,
            align: 'center',
            fixed: 'left',
        },
        {
            title: <b>เลขที่ CN</b>,
            dataIndex: 'docno',
            width: 120,
            align: 'center',
            fixed: 'left',
        },
        {
            title: <b>วันที่</b>,
            dataIndex: 'date',
            width: 100,
            align: 'center',
            fixed: 'left',
            render: (text) => (text ? dayjs(text).utc().format(DATE_FORMAT.DISPLAY) : ''),
        },
        {
            title: <b>ครบกำหนด</b>,
            dataIndex: 'duedate',
            width: 100,
            align: 'center',
            fixed: 'left',
            render: (text) => (text ? dayjs(text).utc().format(DATE_FORMAT.DISPLAY) : ''),
        },
        {
            title: <b>อ้างถึง</b>,
            dataIndex: 'refno',
            width: 120,
            align: 'center',
        },
        {
            title: <b>ใบรับคืน</b>,
            dataIndex: 'pono',
            width: 120,
            align: 'center',
        },
        {
            title: <b>ยอดเดิม</b>,
            dataIndex: 'old_amt',
            width: 120,
            render: (text) => numeral(text).format('0,0.00'),
            align: 'right',
        },
        {
            title: <b>ยอดใหม่</b>,
            dataIndex: 'new_amt',
            width: 120,
            render: (text) => numeral(text).format('0,0.00'),
            align: 'right',
        },
        {
            title: <b>ผลต่าง</b>,
            dataIndex: 'net_amt',
            width: 120,
            render: (text) => numeral(text).format('0,0.00'),
            align: 'right',
        },
        {
            title: <b>ภาษี</b>,
            dataIndex: 'tax_amt',
            width: 100,
            render: (text) => numeral(text).format('0,0.00'),
            align: 'right',
        },
        {
            title: <b>ยอดรวม</b>,
            dataIndex: 'total',
            width: 120,
            render: (text) => numeral(text).format('0,0.00'),
            align: 'right',
        },
        {
            title: <b>รหัสผู้ซื้อ</b>,
            dataIndex: 'customer_id',
            width: 80,
            align: 'center',
        },
        {
            title: <b>ผู้ซื้อ</b>,
            dataIndex: 'customer_name',
            width: 400,
            align: 'left',
        },
    ]

    const handleDeleteCN = (record) => {
        const params = {    
            docno: record.docno,
            rtv_id: record.pono,
        }

         alertConfirm({
                 alert_Title: `ต้องการลบใบลดหนี้ ${record.docno} ใช่หรือไม่?`,
                   onConfirm: async () => {
                      return deleteCN(params)
                },
              success: {
                      success_title: 'ลบใบลดหนี้สำเร็จ',
                     callback: () => handleLoadData(),
                   },
      })
    }

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
                // MenuBtn={() => (
                //     <Row style={{ marginLeft: '5px' }}>
                //         <Btn.Add
                //             onClick={() => {
                //                 navigate(`/CN/${EMenuType.ADD}`)
                //             }}
                //         />
                //     </Row>
                // )}
                loading={loading}
                className={'NTables_' + tabType}
                total={total}
                onSearch={handleLoadData}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                className="n-tableComponent"
                searchList={[
                    {
                        label: 'เลขที่ CN',
                        value: 'docno',
                    },
                    {
                        label: 'รหัสลูกค้า',
                        value: 'customer_id',
                    },
                    {
                        label: 'ลูกค้า',
                        value: 'customer_name',
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

export default CNTable
