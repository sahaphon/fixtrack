import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ModalComponent from "../../components/Modal/ModalComponent"; 
import TableComponent from "../../components/Table/TableComponent";
import Btn from "../../components/Button/BtnComponent";

import { ServiceRole } from "../../service/master/ServiceRole";
import { Button } from "antd";

import { CheckOutlined } from '@ant-design/icons';

const AddRoleModal = ({ 
    visible = false,
    setOpenRoleModal = () => {},
    onSelectData = () => {},
}) => {

  const formRef = useRef()
  const { getRole } = ServiceRole()

  const [dataTable, setDataTable] = useState([])
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const roleColumns = [
     {
        title: 'เลือก',
        key: 'select',
        width: 25,
        align: 'center',
        render: (text, record) => (
            <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => {
                    onSelectData({...record, type: 'Role' });
                    setOpenRoleModal(false);
                }}
            >
                เลือก
            </Button>
        ),
    },
    {
      title: 'รหัส',
      dataIndex: 'role_id',
      align: 'center',
      width: 20
    },
    {
      title: 'ชื่อตำแหน่ง',
      dataIndex: 'role_name_th',
      width: 120
    },
  ];

   const searchRoleTypeList = [
    { value: 'role_id', label: 'รหัส' },
    { value: 'role_name', label: 'ชื่อตำแหน่ง' },
  ]

  const loadData = useCallback(async (type, search, offset, limit) => {
    // console.log('loadData called with:', { type, search, offset, limit });
    setIsLoading(true);

    let data = await getRole({ 
          type_search: type, 
          search: search, 
          offset: offset, 
          limit: limit 
        });

    console.log('data', data);  
    if (data && data.result) {
        setDataTable(data.result.map((item, i) => ({ ...item, key: i })));
        setTotal(data.total || 0);
    }
    else {
        setDataTable([]);
        setTotal(0);
    }
    setIsLoading(false);
  }, [ getRole]);

  return (
    <ModalComponent
      title={ 'เลือกตำแหน่ง' }
      visible={visible}
      onCancel={() => setOpenRoleModal(false)}
      width={800}
      footer={null}
    >
      <TableComponent
        key={`key`}
        columns={ roleColumns }
        className="AddRolenModal"
        dataSource={dataTable}
        total={total}
        searchList={ searchRoleTypeList }
        showSearch={true}
        showTypeSearch={true}
        onSearch={loadData}
        isLoading={isLoading}
        createdColumn={false}
        editColumn={false}
        scroll={false}
        MenuBtn={() => {
            return (
                <>
                    <Btn.Close
                        style={{ marginLeft: 10, width: 110 }}
                        type='CLOSE'
                        onClick={() => setOpenRoleModal(false)}
                        label={'ปิด'}
                    />
                </>
            )
        }}
      />
    </ModalComponent>
  );    
};

export default AddRoleModal;