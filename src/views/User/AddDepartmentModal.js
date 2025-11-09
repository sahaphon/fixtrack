import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ModalComponent from "../../components/Modal/ModalComponent"; 
import TableComponent from "../../components/Table/TableComponent";
import Btn from "../../components/Button/BtnComponent";

import { ServiceDepartment } from '../../service/master/ServiceDepartment'
import { Button } from "antd";

import { CheckOutlined } from '@ant-design/icons';

const AddDepartmentModal = ({ 
    visible = false,
    setOpenModal = () => {},
    onSelectData = () => {},
}) => {

  const formRef = useRef()
  const { getDepartment } = ServiceDepartment()

  const [dataTable, setDataTable] = useState([])
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [forceReset, setForceReset] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const departmentColumns = [
    {
        title: 'เลือก',
        key: 'select',
        width: 15,
        align: 'center',
        render: (text, record) => (
            <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => {
                    onSelectData({...record, type: 'Department'});
                    setOpenModal(false);
                }}
            >
                เลือก
            </Button>
        ),
    },
    {
      title: 'รหัสฝ่าย/แผนก',
      dataIndex: 'dep_code',
      align: 'center',
      width: 20
    },
    {
      title: 'ชื่อฝ่าย/แผนก',
      dataIndex: 'dep_name',
      width: 80
    },
  ];

  const searchDepartmentTypeList = [
    { value: 'dep_code', label: 'รหัส'},
    { value: 'dep_name', label: 'ชื่อฝ่าย/แผนก' },
  ]

  const loadData = useCallback(async (type, search, offset, limit) => {
    console.log('loadData called with:', { type, search, offset, limit });
    setIsLoading(true);

     let data = await getDepartment({ 
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
    
    // Update pagination state
    setPagination({
      current: Math.floor(offset / limit) + 1,
      pageSize: limit,
      total: data?.total || 0
    });
  }, [getDepartment]);

  // Reset function to force table reset
  const resetTable = useCallback(() => {
    setDataTable([]);
    setTotal(0);
    setCurrentPage(1);
    setPagination({ current: 1, pageSize: 10, total: 0 });
    setForceReset(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Fetch items from API or define them statically

    if (visible) {
        // Reset table state and load from offset 0
        resetTable();
        setTimeout(() => {
          const defaultSearchType = 'dep_code'
          loadData(defaultSearchType, '', 0, 10);
        }, 200);
    }
   
  }, [visible]);


  return (
    <ModalComponent
      title={ 'เลือกฝ่าย/แผนก' }
      visible={visible}
      onCancel={() => setOpenModal(false)}
      width={800}
      footer={null}
    >
      <TableComponent
        key={`modal-${forceReset}-${visible ? 'open' : 'closed'}`}
        columns={ departmentColumns }
        className="AddDepartmentModal"
        dataSource={dataTable}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false
        }}
        total={total}
        searchList={ searchDepartmentTypeList }
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
                        onClick={() => setOpenModal(false)}
                        label={'ปิด'}
                    />
                </>
            )
        }}
      />
    </ModalComponent>
  );    
};

export default AddDepartmentModal;