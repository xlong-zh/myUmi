import { memo, useState, useEffect } from 'react';
import { history } from 'umi';
import { useSelector, shallowEqual } from 'react-redux';
import { noticeList, agreementList } from '@/services/index';
import { Row, Col, Button, Tooltip, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import WatchModal from './components/WatchModal';
import iconUrl from './img/iconUrl.png';
import styles from './index.less';

export default memo(function Index(props) {
  const [posItemList, setPosItemList] = useState([{ id: 0, label: '商户实名认证', link: '立即认证', status: 0 }]);
  const [appNum, setAppNum] = useState(1);
  const [appList, setAppList] = useState([{ id: 0, title: '充值API', subTitle: '虚拟商品标准化接口' }]);
  const [noticeListData, setNoticeListData] = useState([]);
  const [agreementListData, setAgreementListData] = useState([]);
  const [code, setCode] = useState('');
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');

  const { userInfo } = useSelector((state) => state.app, shallowEqual);

  useEffect(() => {
    getAgreementList();
    getNoticeList({ page: 1, limit: 5 });
  }, []);

  const getNoticeList = async (form) => {
    try {
      const res = await noticeList(form);
      setNoticeListData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAgreementList = async () => {
    try {
      const res = await agreementList();
      setAgreementListData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const watchAgreement = (code, name) => {
    setModal(true);
    setCode(code);
    setTitle(name);
  };

  const cencelAgreement = () => {
    setModal(false);
    setCode('');
    setTitle('');
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5' }}>
      <div className={styles.titleContainer}>
        <Row style={{ padding: '20px' }}>
          <Col>
            <div className={styles.titleWelcome}>
              <div>欢迎来到华融讯方商户控制台</div>
              <div className={styles.posInfo}>
                <div>当前商户号：{userInfo?.id}</div>
              </div>
            </div>
          </Col>
        </Row>
        <div className={styles.titleItem}>
          <Row>
            {posItemList.map((item) => {
              return (
                <Col span={8} key={item.id} className={styles.itemBox}>
                  <div>
                    {item.label}
                    <span className={[styles.authStatus, styles.authNo].join(' ')}>
                      {`${userInfo?.auth_status}` === '0'
                        ? '审核中'
                        : `${userInfo?.auth_status}` === '1'
                        ? '已认证'
                        : '未认证'}
                    </span>
                  </div>
                  {!['0', '1'].includes(`${userInfo?.auth_status}`) ? (
                    <div onClick={() => history.push('/realnameVerify')}>{item.link} &#62;</div>
                  ) : null}
                  <div className={styles.line}></div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <Row>
          <Col span={16}>
            <div className={styles.leftContainer}>
              <div className={styles.accountContainer}>
                <div className={styles.title}>账户概览</div>
                <div className={styles.content}>
                  <div className={styles.itemBox}>
                    <div className={styles.itemTitle}>
                      <div>账户余额（元）</div>
                      <div style={{ cursor: 'pointer' }} onClick={() => history.push('/balance')}>
                        充值
                      </div>
                    </div>
                    <div className={styles.money}>{userInfo?.amount}</div>
                  </div>
                  <div className={styles.itemBox}>
                    <div className={styles.itemTitle}>
                      <div>冻结金额（元）</div>
                      <div>
                        <Tooltip title="未支付完结的金额" overlayClassName={styles.tipClass}>
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                    </div>
                    <div className={styles.money}>{userInfo?.frozen_amount}</div>
                  </div>
                </div>
              </div>
              <div className={styles.noticeContainer}>
                <div className={styles.title}>
                  平台公告
                  <div className={styles.getMore} onClick={() => history.push('/noticeList')}>
                    更多
                  </div>
                </div>
                <div className={styles.content}>
                  {noticeListData.map((item) => {
                    return (
                      <div
                        className={styles.noticeItem}
                        key={item.id}
                        onClick={() =>
                          history.push({
                            pathname: '/noticeList/detail',
                            state: { noticeId: item.id },
                          })
                        }
                      >
                        <div className={styles.noticeTitle}>【通知】{item.title}</div>
                        <div className={styles.noticeDate}>{item.create_time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.rightContainer}>
              <div className={styles.staffContainer}>
                <div className={styles.logo}></div>
                <div className={styles.phone}>
                  <div>在线客服：7*24小时</div>
                  <div>
                    电话：<span>028-86531011</span>
                  </div>
                </div>
                <div className={styles.consultBtn}>
                  <Button type="primary" size={'large'}>
                    立即咨询
                  </Button>
                </div>
              </div>
              <Card title="平台协议" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {agreementListData.map(({ name, code }) => (
                    <div key={code} className={styles.agreementBox} onClick={() => watchAgreement(code, name)}>
                      <img src={iconUrl} alt="" />
                      {name}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
      {modal && <WatchModal code={code} title={title} onOk={cencelAgreement} onCancel={cencelAgreement} />}
    </div>
  );
});
