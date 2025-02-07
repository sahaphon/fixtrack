import React from 'react'
import { Card, Input } from 'antd'
import bg_img from '../../assets/images/home.png'
import bg_img_mini from '../../assets/images/home-mini.png'
import { THEME_PROGRAM } from '../../config'
import './Home.css'

const Home = () => {
    return (
        <>
            <div className="overlay-page">
                <div style={{ textAlign: 'center' }}>
                    <div
                        className={window.screen.width > 530 ? 'four_bg' : 'four_bg_mini'}
                        style={{
                            marginTop: '-100px',
                            backgroundImage: `${window.screen.width > 530 ? `url("${bg_img}")` : `url("${bg_img_mini}")`}`,
                        }}
                    ></div>
                    <div style={{ textAlign: 'center', marginTop: '-80px' }}>
                        <h3 className="h2">Platform Online</h3>
                        <p style={{ fontSize: '17px' }}>
                            ยินดีต้อนรับเข้าสู่ระบบ{' '}
                            <b style={{ color: THEME_PROGRAM, fontSize: '18px' }}>Online</b>{' '}
                        </p>
                        <u
                            style={{
                                cursor: 'pointer',
                                color: THEME_PROGRAM,
                                fontSize: '13px',
                                marginLeft: '-10px',
                            }}
                        ></u>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
