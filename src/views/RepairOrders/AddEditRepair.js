import React, { useState, useEffect, useRef, use } from "react";
import { 
    Card, 
    Form, 
    Row, Col, Input, DatePicker, Select, Button, Divider, Collapse, Space} from "antd";
import { DATE_FORMAT } from '../../config'
import dayjs from 'dayjs'

import { 
    UserOutlined, 
    ProfileOutlined, 
    DeleteOutlined, 
    SettingOutlined, 
    ToolOutlined, 
    PictureOutlined, 
    PaperClipOutlined,
    SaveOutlined,
    CloseOutlined,
 } from '@ant-design/icons'
import User from "../User/User";

import { toast } from "../../components/Toast";
import AssetModal from "./AssetModal";

const { ServiceDepartment } = require('../../service/master/ServiceDepartment')    
const { ServiceDivision } = require('../../service/master/ServiceDivision')    
const { ServiceFireStation } = require('../../service/master/ServiceFireStation')

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } } // ปรับความกว้าง label / input
const tail = { wrapperCol: { span: 24 } }

const AddEditRepair = () => {
  const headerFormRef = useRef()
  const infoFormRef = useRef()
  const detailsFormRef = useRef()

  const { getAllDepartment } = ServiceDepartment()
  const { getAllDivision } = ServiceDivision()
  const { getAllFireStation } = ServiceFireStation()

  const [departmentList, setDepartmentList] = useState([]);   
  const [divisionList, setDivisionList] = useState([]); 
  const [fireStationList, setFireStationList] = useState([]);

  // State สำหรับ cascading dropdown
  const [selectedFromDivision, setSelectedFromDivision] = useState(null);
  const [filteredStations, setFilteredStations] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // State สำหรับผู้รับแจ้งซ่อม
  const [selectedToDivision, setSelectedToDivision] = useState(null);
  const [filteredToDepartments, setFilteredToDepartments] = useState([]);

  const [isOpenModal, setOpenModal] = useState(false);

  // ข้อมูลหัวข้อและรายการย่อย
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState("");
    // ไฟล์รูปประกอบการแจ้งซ่อม
  const [attachments, setAttachments] = useState([]);

  useEffect(() => { 
    loadDepartments();
    loadDivisions();
    loadFireStations();
  }, []);

  const loadDepartments = async () => {         
    try {   
        const data = await getAllDepartment()
        console.log('data departments : ', data)
        if (data) {
            setDepartmentList(data)
        }
    } catch (e) {
        console.error(e)
    }
  }

  const loadDivisions = async () => { 
    try {   
        const data = await getAllDivision()
        console.log('data divisions : ', data)
        if (data) {
            setDivisionList(data)
        }
    } catch (e) {
        console.error(e)
    }
  }

  const loadFireStations = async () => { 
    try {   
        const data = await getAllFireStation()
        console.log('data fire stations : ', data)
        if (data) {
            setFireStationList(data)
        }   
    } catch (e) {
        console.error(e)
    }
  } 

  // ฟังก์ชันจัดการการเลือกสังกัด/กอง
  const handleFromDivisionChange = (value) => {
    setSelectedFromDivision(value);
    
    // กรองสถานีตามสังกัด/กอง (เฉพาะที่มี division_id ตรงกัน)
    const stationsForDivision = fireStationList.filter(station => 
      station.division_id === value
    );
    setFilteredStations(stationsForDivision);
    
    // กรองฝ่าย/หน่วยงานตามสังกัด/กอง (เฉพาะที่มี division_id ตรงกัน)
    const departmentsForDivision = departmentList.filter(department =>
      department.division_id === value
    );
    setFilteredDepartments(departmentsForDivision);
    
    // รีเซ็ตค่าที่เลือกใน station และ department
    const form = infoFormRef.current;
    if (form) {
      form.setFieldsValue({
        from_station: undefined,
        from_department: undefined
      });
    }
    
    // console.log('Selected Division ID:', value);
    // console.log('Filtered Stations:', stationsForDivision);
    // console.log('Filtered Departments:', departmentsForDivision);
  };

  // ฟังก์ชันจัดการการเลือกสังกัด/กองผู้รับแจ้ง
  const handleToDivisionChange = (value) => {
    setSelectedToDivision(value);
    
    // กรองฝ่าย/หน่วยงานตามสังกัด/กอง (เฉพาะที่มี division_id ตรงกัน)
    const departmentsForToDivision = departmentList.filter(department =>
      department.division_id === value
    );
    setFilteredToDepartments(departmentsForToDivision);
    
    // รีเซ็ตค่าที่เลือกใน department
    const form = infoFormRef.current;
    if (form) {
      form.setFieldsValue({
        to_department: undefined
      });
    }
    
    // console.log('Selected To Division ID:', value);
    // console.log('Filtered To Departments:', departmentsForToDivision);
  };

  // ฟังก์ชันสำหรับดูค่าทั้งหมดใน form (สำหรับ debug)
  const getAllFormValues = () => {
    const form_h = headerFormRef.current;
    const form_title = infoFormRef.current;

    if (form_title) {
      const values = form_title.getFieldsValue();
      const value2 = form_h.getFieldsValue();
      console.log('All Form Values:', values);
      console.log('All Form Values:', value2);

      return values;
    }
    return {};
  };

  // ฟังก์ชันบันทึกข้อมูลทั้งหมดพร้อมเช็ค validation
  const handleSaveAll = async () => {
    try {
      // Validate ฟอร์มทั้ง 3 ฟอร์ม
      const headerValues = await headerFormRef.current?.validateFields();
      const infoValues = await infoFormRef.current?.validateFields();
      const detailsValues = await detailsFormRef.current?.validateFields();

      // รวมข้อมูลทั้งหมด
      const allData = {
        header: headerValues,
        info: infoValues,
        details: detailsValues,
        topics: topics,
        attachments: attachments.map(att => att.file),
      };

      console.log('All validated data:', allData);

      // แสดง toast success
      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว', {
        description: 'ข้อมูลการแจ้งซ่อมถูกบันทึกเรียบร้อยแล้ว',
        duration: 3000,
      });

      // TODO: เรียก API เพื่อบันทึกข้อมูล
      // await saveRepairOrder(allData);

    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
      
      // หาฟอร์มที่มี error
      const errorFields = errorInfo.errorFields || [];
      if (errorFields.length > 0) {
        const firstError = errorFields[0];
        const fieldName = firstError.name[0];
        
        // แสดง toast error พร้อมรายละเอียด
        toast.error('กรุณากรอกข้อมูลให้ครบถ้วน', {
          description: firstError.errors[0] || 'มีฟิลด์ที่จำเป็นยังไม่ได้กรอก',
          duration: 4000,
        });

        // Scroll ไปยังฟอร์มที่มี error
        if (headerFormRef.current && headerFormRef.current.getFieldError(fieldName).length > 0) {
          // Error ในฟอร์มที่ 1
          console.log('Error in header form');
        } else if (infoFormRef.current && infoFormRef.current.getFieldError(fieldName).length > 0) {
          // Error ในฟอร์มที่ 2
          console.log('Error in info form');
        } else if (detailsFormRef.current && detailsFormRef.current.getFieldError(fieldName).length > 0) {
          // Error ในฟอร์มที่ 3
          console.log('Error in details form');
        }
      } else {
        toast.error('เกิดข้อผิดพลาดในการบันทึก', {
          description: 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
          duration: 4000,
        });
      }
    }
  };

   // ✅เพิ่มหัวข้อหลัก
  const addTopic = () => {
    if (!topicName.trim()) return alert("กรอกชื่อหัวข้อก่อน");
    setTopics([
      ...topics,
      {
        id: Date.now(),
        name: topicName,
        items: []
      }
    ]);
    setTopicName("");
  };

  // ✅ ลบหัวข้อ
  const deleteTopic = (topicId) => {
    if (!confirm("ต้องการลบหัวข้อนี้ใช่ไหม?")) return;
    setTopics(topics.filter((topic) => topic.id !== topicId));
  };

  // ✅ เพิ่มรายการย่อย
  const addItem = (topicId) => {
    const input = prompt("กรอกรายการย่อย:");
    if (!input) return;

    setTopics(
      topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              items: [
                ...topic.items,
                { id: Date.now(), detail: input }
              ]
            }
          : topic
      )
    );
  };

  // ✅ ลบรายการย่อย
  const deleteItem = (topicId, itemId) => {
    setTopics(
      topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              items: topic.items.filter((item) => item.id !== itemId)
            }
          : topic
      )
    );
  };


  // ✅ เลือกรูป (แนบไฟล์)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const mapped = files.map((file) => ({
      id: `${Date.now()}_${file.name}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...mapped]);

    // reset input เดิม เพื่อให้เลือกไฟล์ชุดเดิมซ้ำได้ถ้าต้องการ
    e.target.value = "";
  };

  // ✅ ลบรูปแนบ
  const removeAttachment = (id) => {
    setAttachments((prev) => {
      // cleanup URL object ด้วย
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleSelectAsset = (data) => {     
    console.log('Selected Asset:', data);
    };


  return (
        <Card style={{ borderRadius: 8 }}>
            <Collapse 
                defaultActiveKey={['1']}
                style={{ marginBottom: 10 }}
                items={[
                    {
                        key: '1',
                        label: (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span>หัวเรื่องใบแจ้งซ่อม</span>
                                <span>ส่วนที่ (1)</span>
                            </div>
                        ),
                        children: (
                            <Form
                                ref={headerFormRef}
                                name="header_form"
                                autoComplete="off"
                            >   
                                {/* gutter={16} คือ ระยะห่างระหว่างคอลัมน์ (16px ทั้งแนวตั้งและแนวนอน) */}
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label="วันที่"
                                            labelCol={{ span: 20 }}
                                            wrapperCol={{ span: 4 }}
                                            name="date"
                                            rule={[
                                                {
                                                    required: true,
                                                    message: "กรุณาเลือกวันที่"
                                                },
                                            ]}
                                        >
                                            <DatePicker 
                                                format={DATE_FORMAT.DISPLAY} 
                                                style={{ width: '100%' }} 
                                                defaultValue={dayjs()} 
                                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                                // disabled
                                                // onChange={(date, dateString) => handleDatePickerChange(date, dateString)}
                                            />
                                        </Form.Item>    
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                           label="เรียน"
                                           name="to"
                                           rule={[
                                            {
                                                required: true,
                                                message: "กรุณาระบุ"
                                            },
                                        ]}
                                       >
                                           <Input />
                                       </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                           label="ความเร่งด่วน"
                                           labelCol={{ span: 8 }}
                                           wrapperCol={{ span: 16 }}
                                           name="urgent"
                                           rule={[
                                            {
                                                required: true,
                                                message: "กรุณาเลือกความเร่งด่วน"
                                            },
                                        ]}
                                       >
                                          <Select   
                                            placeholder="เลือกความเร่งด่วน"
                                            defaultValue="0"
                                            // onChange={handleSelectChange}
                                          >
                                              <Select.Option value="0">ปกติ</Select.Option>
                                              <Select.Option value="1">ด่วน</Select.Option>
                                              <Select.Option value="2">ด่วนมาก</Select.Option>
                                          </Select>  
                                       </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                    </Col>
                                </Row>
                            </Form>
                        )
                    }
                ]}
            />
            <Collapse 
                defaultActiveKey={['2']}

                style={{ marginBottom: 10 }}
                items={[
                    {
                        key: '2',
                        label: (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                width: '100%' 
                            }}>
                                <span>ข้อมูลผู้แจ้ง-รับแจ้งซ่อม</span>
                                <span>ส่วนที่ (2)</span>
                            </div>
                        ),
                        children: (
                            <Form
                                ref={infoFormRef}
                                name="info_form"
                                autoComplete="off"
                            >   
                                {/* gutter={16} คือ ระยะห่างระหว่างคอลัมน์ (16px ทั้งแนวตั้งและแนวนอน) */}
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        {/* คอลัมน์ซ้าย */}
                                        <Card
                                            size="small"
                                            title={<><ProfileOutlined /> ข้อมูลผู้แจ้งซ่อม</>}
                                            styles={{
                                                header: { 
                                                    backgroundColor: '#eeececff', 
                                                    borderBottom: '1px solid #d9d9d9' 
                                                },
                                                body: { paddingTop: 16 }
                                            }}
                                        >
                                            <Form.Item
                                                label="สังกัด/กอง"
                                                {...layout}
                                                name="from_division"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "กรุณาเลือกสังกัด/กอง"
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="เลือกสังกัด/กอง"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    onChange={handleFromDivisionChange}
                                                    options={divisionList.map((division) => ({
                                                        label: division.division_name,
                                                        value: division.division_id,
                                                    }))}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="สถานี"
                                                {...layout}
                                                name="from_station"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "กรุณาเลือกสถานี"
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder={selectedFromDivision ? "เลือกสถานี" : "กรุณาเลือกสังกัด/กองก่อน"}
                                                    disabled={!selectedFromDivision || filteredStations.length === 0}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    // onChange={handleStationChange}
                                                    options={filteredStations.map((station) => ({
                                                        label: station.station_name,
                                                        value: station.station_code,
                                                    }))}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="ฝ่าย/หน่วยงาน"
                                                {...layout}
                                                name="from_department"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "กรุณาเลือกฝ่าย/หน่วยงาน"
                                                    },
                                                ]}
                                            >
                                                <Select 
                                                    showSearch
                                                    placeholder={selectedFromDivision ? "เลือกฝ่าย/หน่วยงาน" : "กรุณาเลือกสังกัด/กองก่อน"}
                                                    disabled={!selectedFromDivision || filteredDepartments.length === 0}
                                                    optionFilterProp="children" 
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    // onChange={handleFromDepartmentChange}
                                                    options={filteredDepartments.map((department) => ({
                                                        label: department.dep_name,
                                                        value: department.dep_code,
                                                    }))}
                                                />
                                            </Form.Item>
                                        </Card>
                                    </Col>
                                    <Col xs={24} md={12}>
                                       <Card
                                            size="small"
                                            title={<><ProfileOutlined /> ข้อมูลผู้รับแจ้งซ่อม</>}
                                            styles={{
                                                header: { 
                                                    backgroundColor: '#eeececff', 
                                                    borderBottom: '1px solid #d9d9d9' 
                                                },
                                                body: { paddingTop: 16 }
                                            }}
                                        >
                                            <Form.Item
                                                label="สังกัด/กอง"
                                                {...layout}
                                                name="to_division"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "กรุณาเลือกสังกัด/กอง"
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="เลือกสังกัด/กอง"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    onChange={handleToDivisionChange}
                                                    options={divisionList.map((division) => ({
                                                        label: division.division_name,
                                                        value: division.division_id,
                                                    }))}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="ฝ่าย/หน่วยงาน"
                                                {...layout}
                                                name="to_department"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "กรุณาเลือกฝ่าย/หน่วยงานผู้รับซ่อม"
                                                    },
                                                ]}
                                            >
                                                <Select 
                                                    showSearch
                                                    placeholder={selectedToDivision ? "เลือกฝ่าย/หน่วยงานผู้รับซ่อม" : "กรุณาเลือกสังกัด/กองก่อน"}
                                                    disabled={!selectedToDivision || filteredToDepartments.length === 0}
                                                    optionFilterProp="children" 
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    // onChange={handleToDepartmentChange}
                                                    options={filteredToDepartments.map((department) => ({
                                                        label: department.dep_name,
                                                        value: department.dep_code,
                                                    }))}
                                                />
                                            </Form.Item> 
                                            
                                       </Card>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={24} style={{ marginTop: '10px' }}>
                                        <Card
                                            size="small"
                                            title={<><UserOutlined /> ติดต่อประสานงาน</>}
                                            styles={{
                                                header: { 
                                                    backgroundColor: '#eeececff', 
                                                    borderBottom: '1px solid #d9d9d9' 
                                                },
                                                body: { paddingTop: 16 }
                                            }}
                                        >
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label="ผู้ติดต่อ"
                                                        labelCol={{ span: 4 }}
                                                        wrapperCol={{ span: 18 }}
                                                        name="contact_name"
                                                        rule={[
                                                            {
                                                                required: true,
                                                                message: "กรุณาระบุชื่อผู้แจ้งซ่อม"
                                                            },
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                               
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                   <Form.Item
                                                        label="ตำแหน่ง"
                                                        labelCol={{ span: 4 }}
                                                        wrapperCol={{ span: 18 }}
                                                        name="contact_position"
                                                        rule={[
                                                            {
                                                                required: true,
                                                                message: "กรุณาระบุตำแหน่ง"
                                                            },
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                  <Form.Item
                                                        label="เบอร์ติดต่อ"
                                                        labelCol={{ span: 6 }}
                                                        wrapperCol={{ span: 18 }}
                                                        name="contact_phone"
                                                        rule={[
                                                            {
                                                                required: true,
                                                                message: "กรุณาระบุเบอร์ติดต่อ"
                                                            },
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Form>
                        )
                    }
                ]}
            />
            <Collapse 
                defaultActiveKey={['3']}
                style={{ marginBottom: 10 }}
                items={[
                    {
                        key: '3',
                        label: (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span><><ProfileOutlined /> รายละเอียดแจ้งซ่อม</></span>
                                <span>ส่วนที่ (3)</span>
                            </div>
                        ),
                        children: (
                <Form
                    ref={detailsFormRef}
                    name="details_form"
                    autoComplete="off"
                >
                    <Card
                       style={{ borderRadius: 5, marginTop: 10 }}
                    >
                        <Row gutter={16}>
                            <Col span={14}>
                                <Form.Item
                                    label="ประเภทการซ่อม"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 10 }}
                                    name="type_service"
                                    rule={[
                                        {
                                            required: true,
                                            message: "กรุณาเลือกประเภทการซ่อม"
                                        },
                                    ]}
                                >   
                                    <Select   
                                        placeholder="เลือกประเภทการซ่อม"
                                        defaultValue="0"
                                        // onChange={handleSelectChange}
                                    >
                                        <Select.Option value="0">การซ่อมบำรุงตามระยะ</Select.Option>
                                        <Select.Option value="1">การซ่อมแซมเมื่อชำรุด</Select.Option>
                                        <Select.Option value="2">การบำรุงรักษาเชิงรุก</Select.Option>
                                    </Select>  
                                </Form.Item>    
                             </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={14}>
                           <Form.Item
                                label="ทะเบียนทรัพย์สิน"
                                // labelCol={{ span: 6 }}
                                // wrapperCol={{ span: 18 }}
                                {...layout}
                                name="asset_no"
                                rule={[
                                    {
                                        required: true,
                                        message: "กรุณาเลือกทะเบียนทรัพย์สิน"
                                    },
                                ]}
                            >   
                                <Space.Compact style={{ width: '100%' }}>
                                    <Input 
                                        // style={{ width: 'calc(100% - 80px)' }}
                                        placeholder="เช่น 1234567890"
                                    />
                                    <Button 
                                        type="primary" 
                                        style={{ width: '80px' }} 
                                        onClick={() => {
                                            setOpenModal(true);
                                        }}>
                                            ค้นหา</Button>
                                </Space.Compact>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={14}>
                            <Form.Item
                                label="รายละเอียดทรัพย์สิน"
                                labelCol={{ span: 6 }}
                                name="asset_info"
                                rule={[
                                    {
                                        required: true,
                                        message: "กรุณาระบุรายละเอียดทรัพย์สิน"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                label="ทะเบียนรถ"
                                labelCol={{ span: 4 }}
                                // wrapperCol={{ span: 18 }}
                                name="plate_no"
                                rule={[
                                    {
                                        required: true,
                                        message: "กรุณาระบุทะเบียนรถ"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={14}>
                         <Form.Item
                                label="ยี่ห้อ"
                                labelCol={{ span: 6 }}
                                // wrapperCol={{ span: 18 }}
                                name="brand"
                                rule={[
                                    {
                                        required: true,
                                        message: "กรุณาระบุรุ่น"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                label="รุ่น"
                                labelCol={{ span: 4 }}      
                                // wrapperCol={{ span: 18 }}
                                name="model"
                                rule={[
                                    {
                                        required: true,
                                        message: "กรุณาระบุรุ่น"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                  {/* แบบฟอร์มเพิ่มหัวข้อ */}
                    <div><h6 style={{ color: 'blueviolet'}}>**เพิ่มข้อมูลรายละเอียดการแจ้งซ่อม</h6></div>
                    <div
                        style={{
                            border: "1px solid #e0e0e0",
                            background: "#f8f8f8",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 20
                        }}
                    >
                        <label>ชื่อหัวข้อ:</label>
                        <input
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        style={{
                            width: "40%",
                            marginLeft: 10,
                            padding: 6,
                            borderRadius: 4,
                            border: "1px solid #ccc"
                        }}
                        />
                        <button
                        onClick={addTopic}
                        style={{
                            marginLeft: 10,
                            padding: "6px 12px",
                            background: "#1677ff",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                        >
                        + เพิ่มหัวข้อ
                        </button>
                    </div>

                    {/* แสดงหัวข้อทั้งหมด */}
                    {topics.map((topic) => (
                        <div
                        key={topic.id}
                        style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 8,
                            padding: 15,
                            marginBottom: 16,
                            background: "#fff"
                        }}
                        >
                        <div
                            style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                            }}
                        >
                            <h5 style={{ margin: 0 }}><ToolOutlined /> {topic.name}</h5>

                            {/* ปุ่มลบหัวข้อ */}
                            <button
                            onClick={() => deleteTopic(topic.id)}
                            style={{
                                background: "#ff4d4f",
                                color: "#fff",
                                border: "none",
                                padding: "4px 10px",
                                borderRadius: 4,
                                cursor: "pointer"
                            }}
                            >
                            <DeleteOutlined /> ลบหัวข้อ
                            </button>
                        </div>


                        {/* รายการย่อย */}
                
                        <ul style={{ marginTop: 10 }}>
                            {topic.items.map((item) => (
                            <li key={item.id} style={{ marginBottom: 6 }}>
                                {item.detail}

                                {/* ปุ่มลบรายการย่อย */}
                                <button
                                onClick={() => deleteItem(topic.id, item.id)}
                                style={{
                                    marginLeft: 10,
                                    background: "#ff7875",
                                    color: "#fff",
                                    border: "none",
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    fontSize: 12
                                }}
                                >
                                <DeleteOutlined /> ลบรายการ
                                </button>
                            </li>
                            ))}

                            {topic.items.length === 0 && (
                            <li style={{ color: "#888" }}>ยังไม่มีรายการย่อย</li>
                            )}
                        </ul>

                        {/* ปุ่มเพิ่มรายการย่อย */}
                        <button
                            onClick={() => addItem(topic.id)}
                            style={{
                            marginTop: 10,
                            padding: "4px 10px",
                            background: "#52c41a",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                            }}
                        >
                            + เพิ่มรายการย่อย
                        </button>
                        </div>
                    ))}
       {/* ---------------- ส่วนแนบรูปประกอบการแจ้งซ่อม ---------------- */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            marginTop: 24,
            background: "#fafafa",
          }}
        >
          <h6 style={{ marginTop: 0 }}><PaperClipOutlined /> รูปประกอบการแจ้งซ่อม</h6>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          {attachments.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 12,
              }}
            >
              {attachments.map((att) => (
                <div
                  key={att.id}
                  style={{
                    width: 120,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: 6,
                    background: "#fff",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 80,
                      overflow: "hidden",
                      marginBottom: 4,
                    }}
                  >
                    <img
                      src={att.preview}
                      alt={att.file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={att.file.name}
                  >
                    {att.file.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    style={{
                      marginTop: 4,
                      background: "#ff7875",
                      color: "#fff",
                      border: "none",
                      padding: "2px 8px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                  >
                    ลบรูป
                  </button>
                </div>
              ))}
            </div>
          )}

          {attachments.length === 0 && (
            <p style={{ marginTop: 8, fontSize: 13, color: "#888" }}>
              ยังไม่ได้แนบรูป สามารถเลือกได้หลายรูปในครั้งเดียว
            </p>
          )}
        </div>
                    </Card>
                </Form>
                        )
                    }
                ]}
            />
            
            <div style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                background: "#fff",
                borderTop: "1px solid #eee",
                textAlign: "right",
                }}
            >
            <Button type="default" size="middle" onClick={getAllFormValues} style={{ marginRight: 8 }}>
                Debug Form
            </Button>
            <Button 
                type="primary" 
                size="middle" 
                icon={<SaveOutlined />}
                onClick={handleSaveAll}
            >
                บันทึกทั้งหมด
            </Button>
            <Button type="" style={{ color: "#fff", width: 120, backgroundColor: 'red', marginLeft: 8 }} icon={<CloseOutlined />}>
                ยกเลิก
            </Button>
            </div>
            <AssetModal 
                visible={isOpenModal} 
                selectData={handleSelectAsset} 
                setOpenModal={setOpenModal}
            />
        </Card>
  ); 
};

export default AddEditRepair;