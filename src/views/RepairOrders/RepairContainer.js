import { Badge, Card, Tabs } from 'antd'
import React, { useState, useEffect } from 'react'

// import CNTable from './CNTable'
import TabsComponent from '../../components/Tabs/TabsComponent'
import { ServiceRepair } from '../../service/ServiceRepair'

const CNContainer = () => {
    const { getBadgeCount } = ServiceRepair()
    const [badge, setBadge] = useState({
        cn: 0,
        wait_confirm: 0,
        all: 0,
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const result = await getBadgeCount()
        console.log('badge count : ', result)
        setBadge(result)
    }

    return (
        <Card>
            <TabsComponent
                className="RepairTabs"
                items={[
                    {
                        key: '1',
                        label: (
                            <Badge
                                count={badge.wait_confirm}
                                offset={[18 - 5]}
                                color="red"
                                overflowCount={9999}
                            >
                               รออนุมัติ
                            </Badge>
                        ),
                        // children: <CNTable 
                        //     tabType={'wait_confirm'}
                        //     tabFilter={{ status_cn: ['wait_confirm'], cancel: [false] }}
                        //     // setBadge={setBadge}
                        // />,
                    },
                    {
                        key: '2',
                        label: (
                            <Badge
                                count={badge.confirmed}
                                offset={[18 - 5]}
                                color="green"
                                overflowCount={9999}
                            >
                                อนุมัติแล้ว
                            </Badge>
                        ),
                        // children: <CNTable 
                        //     tabType={'confirmed'}
                        //     tabFilter={{ status_cn: ['confirmed'], cancel: [false] }}
                        //     // setBadge={setBadge}
                        // />,
                    },
                    {
                        label: (
                            <Badge
                                count={badge.all}
                                offset={[18 - 5]}
                                color="blue"
                                overflowCount={9999}
                            >
                                 ทั้งหมด
                            </Badge>
                        ),
                        key: '3',
                        // children: <CNTable 
                        //    tabType={'all'}
                        // //    setBadge={setBadge}
                        // />,
                    },
                ]}
                defaultActiveKey="1"
            />
        </Card>
    )
}

export default CNContainer