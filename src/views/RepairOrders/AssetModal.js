import react, { useState, useRef, useEffect } from 'react'
import ModalComponent from '../../components/Modal/ModalComponent'
import TableComponent from '../../components/Table/TableComponent'
import Btn from '../../components/Button/BtnComponent'

import { ServiceAsset } from '../../service/ServiceAsset'

const AssetModal = ({ visible ={ }, selectData = [], setOpenModal = () => {} }) => {
    const { getAssetByLimit } = ServiceAsset()
    const tableRef = useRef()
    const [assetData, setAssetData] = useState(null)

    const [dataTable, setDataTable] = useState([])
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false)

    const searchTypeList = [
        { label: 'รหัสทรัพย์สิน', value: 'asset_no' },
        { label: 'ชื่อทรัพย์สิน', value: 'asset_name' },
    ]

    const loadData = async (type, search, offset, limit) => {
        setIsLoading(true)
        let params = {
            type_search: type,
            search: search,
            offset: offset,
            limit: limit
        }

        let data = await getAssetByLimit(params)
        if (data && data.result) {
            setDataTable(data.result.map((item, i) => ({ ...item, key: i })))
            setTotal(data.total || 0)
        } else {
            setDataTable([])
            setTotal(0)
        }

        setIsLoading(false) 
    }

    const columns = [
        {
            title: 'เลือก',
            key: 'select',
            width: 70,
            align: 'center',
            fixed: 'left',
            render: (text, record) => (
                <Btn.Add
                    label={'เลือก'}
                    onClick={() => {
                        onSelectData({...record, type: 'Department'});
                        setOpenModal(false);
                    }}
                />
            ),
        },
        {
            title: 'หมายเลขทรัพย์สิน',
            dataIndex: 'asset_no',
            align: 'center',
            fixed: 'left',
            width: 180
        },
        {
            title: 'ชื่อทรัพย์สิน',
            dataIndex: 'asset_name',
            width: 280
        },
        {
            title: 'ประเภททรัพย์สิน',
            dataIndex: 'asset_type_name',
            align: 'center',
            width: 140
        },
        {
            title: 'ยี่ห้อ',
            dataIndex: 'brand',
            align: 'center',
            width: 100
        },
        {
            title: 'รุ่น / Model',
            dataIndex: 'model',
            align: 'center',
            width: 120
        },
        {
            title: 'ป้ายทะเบียน',
            dataIndex: 'plate_no',
            align: 'center',
            width: 80
        },
    ]

    return (
            <ModalComponent
                title={ 'เลือกทรัพย์สิน' }
                visible={visible}
                onCancel={() => setOpenModal(false)}
                width={1100}
                footer={null}
            >
                <TableComponent
                        rowKey={'key'}
                        columns={ columns }
                        className="AssetModal"
                        dataSource={dataTable}
                        total={total}
                        searchList={ searchTypeList }
                        showSearch={true}
                        showTypeSearch={true}
                        onSearch={loadData}
                        isLoading={isLoading}
                        createdColumn={false}
                        editColumn={false}
                        scroll={{ x: 1200 }}
                        MenuBtn={() => {
                            return (
                                <>
                                    <Btn.Close
                                        style={{ marginLeft: 10, width: 110 }}
                                        type='CLOSE'
                                        onClick={() => setOpenModal(false)}
                                        label={'ปิด'}
                                    />
                                </>
                            )
                        }}
                />
            </ModalComponent>
    )
}

export default AssetModal;
