import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Row, Col, Input, DatePicker} from "antd";
import { DATE_FORMAT } from '../../config'
import dayjs from 'dayjs'

import { UserOutlined, ProfileOutlined } from '@ant-design/icons'

const AddEditRepair = () => {
  const formRef = useRef()

  const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } } // ปรับความกว้าง label / input
  const tail = { wrapperCol: { span: 24 } }

  return (
        <Card style={{ borderRadius: 8 }}>
            <Card 
                style={{ borderRadius: 10 }}
                headStyle={{ 
                    backgroundColor: '#eeececff', 
                    borderBottom: '1px solid #d9d9d9' 
                }}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>หัวเรื่องใบแจ้งซ่อม</span>
                        <span>ส่วนที่ (1)</span>
                    </div>
                }
            >
                <Form
                    ref={formRef}
                    name="cn_form"
                    autoComplete="off"
                >   
                    {/* gutter={16} คือ ระยะห่างระหว่างคอลัมน์ (16px ทั้งแนวตั้งและแนวนอน) */}
                    <Row gutter={16}>
                        <Col span={12}>
                           <Form.Item
                               label="เรียน"
                               name="to"
                               rule={[
                                {
                                    required: true,
                                    message: "กรุณาเลือกประเภท"
                                },
                            ]}
                           >
                               <Input />
                           </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="วันที่"
                                labelCol={{ span: 16 }}
                                wrapperCol={{ span: 8 }}
                                name="date"
                                rule={[
                                    {
                                        required: true,
                                        message: "กรุณาเลือกประเภท"
                                    },
                                ]}
                            >
                                <DatePicker 
                                    format={DATE_FORMAT.DISPLAY} 
                                    style={{ width: '100%' }} 
                                    defaultValue={dayjs()} 
                                    // disabled
                                    // onChange={(date, dateString) => handleDatePickerChange(date, dateString)}
                                />
                            </Form.Item>    
                        </Col>
                    </Row>

                </Form>
            </Card>
              <Card 
                style={{ borderRadius: 10, marginTop: 10 }}
                headStyle={{ 
                    backgroundColor: '#eeececff', 
                    borderBottom: '1px solid #d9d9d9' 
                }}
                title={
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        width: '100%', 
                    }}>
                        <span>คำนำ</span>
                        <span>ส่วนที่ (2)</span>
                    </div>
                }
            >
                <Form
                    ref={formRef}
                    name="cn_form"
                    autoComplete="off"
                >   
                    {/* gutter={16} คือ ระยะห่างระหว่างคอลัมน์ (16px ทั้งแนวตั้งและแนวนอน) */}
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            {/* คอลัมน์ซ้าย */}
                            <Card
                                size="small"
                                title={<><ProfileOutlined /> ข้อมูลผู้แจ้งซ่อม</>}
                                headStyle={{ 
                                    backgroundColor: '#eeececff', 
                                    borderBottom: '1px solid #d9d9d9' 
                                }}
                                bodyStyle={{ paddingTop: 16 }}
                            >
                                <Form.Item
                                    label="สังกัด/กอง"
                                    {...layout}
                                    name="from_division"
                                    rule={[
                                        {
                                            required: true,
                                            message: "กรุณาเลือกสังกัด/กอง"
                                        },
                                    ]}
                                >

                                </Form.Item>

                                <Form.Item
                                    label="สถานี"
                                    {...layout}
                                    name="from_station"
                                    rule={[
                                        {
                                            required: true,
                                            message: "กรุณาเลือกสังกัด/กอง"
                                        },
                                    ]}
                                >

                                </Form.Item>

                                <Form.Item
                                    label="ฝ่าย / หน่วยงาน"
                                    {...layout}
                                    name="from_department"
                                    rule={[
                                        {
                                            required: true,
                                            message: "กรุณาเลือกสังกัด/กอง"
                                        },
                                    ]}
                                >

                                </Form.Item>

                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                           
                        </Col>
                    </Row>

                </Form>
            </Card>
            
        </Card>
  ); 
};

export default AddEditRepair;