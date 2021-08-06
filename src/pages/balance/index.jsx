import { memo, useState, useRef, useEffect } from 'react';
import { Row, Col, Divider, DatePicker, Form, Button, Select, Table } from 'antd';
import { useSelector, shallowEqual } from 'react-redux';
import { Link } from 'umi';
import { Descriptions } from 'antd';
import { balanceList, getAccountInfo } from '@/services/index';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default memo(function Index() {
  const { userInfo = {} } = useSelector((state) => state.app, shallowEqual);
  const formRef = useRef();

  const [tableList, setTableList] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });
  const [dates, setDates] = useState([]);
  const [accountInfo, setAccountInfo] = useState({});

  const defaultSelectDate = [moment().startOf('day').subtract(1, 'd'), moment().endOf('day')];
  const columns = [
    {
      title: '序号',
      dataIndex: 'projNum',
      key: 'projNum',
      render: (text, record, index) => ++index,
      width: '6%',
      align: 'center',
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
      align: 'center',
    },
    {
      title: '明细',
      dataIndex: 'detail',
      key: 'detail',
      width: '25%',
      align: 'center',
    },
    {
      title: '截止余额',
      dataIndex: 'amount',
      key: 'amount',
      width: '25%',
      align: 'center',
    },
    {
      title: '记录时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text, record) => moment(record).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
    },
  ];

  useEffect(() => {
    const defInfo = formRef.current.getFieldsValue();
    fetchAccountInfo();
    getBalance({
      ...pagination,
      type: defInfo.type,
      between_time: `${defInfo.between_time[0].format('YYYY-MM-DD HH:mm:ss')} ~ ${defInfo.between_time[1].format(
        'YYYY-MM-DD HH:mm:ss',
      )}`,
    });
  }, []);

  const getBalance = async (form) => {
    try {
      const res = await balanceList(form);
      setTableList(res.data.data);
      setPagination((val) => ({ ...val, total: res.data.count }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAccountInfo = async () => {
    try {
      const res = await getAccountInfo();
      setAccountInfo(res?.data || {});
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    const rangeTimeValue = values['between_time'];
    const formData = {
      ...values,
      between_time:
        rangeTimeValue &&
        `${moment(rangeTimeValue[0]).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(rangeTimeValue[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        )}`,
      ...pagination,
    };
    getBalance(formData);
  };
  const changePage = (current, pageSize) => {
    const defInfo = formRef.current.getFieldsValue();
    setPagination((val) => ({ ...val, page: current, limit: pageSize }));
    getBalance({
      page: current,
      limit: pageSize,
      type: defInfo.type,
      between_time: `${defInfo.between_time[0].format('YYYY-MM-DD HH:mm:ss')} ~ ${defInfo.between_time[1].format(
        'YYYY-MM-DD HH:mm:ss',
      )}`,
    });
  };

  const style = {
    padding: '20px 17px',
    height: '84px',
    width: '100%',
    borderRadius: '8px',
  };

  return (
    <div style={{ padding: '0 20px 0 20px' }}>
      <Row>
        <Col style={{ paddingTop: 30, marginBottom: 30 }} span={24}>
          <div style={style}>
            <h4 style={{ fontSize: '20px' }}>对公汇款充值账号信息</h4>
            {`${userInfo?.auth_status}` !== '1' ? (
              <div className={styles.warn}>
                为保障资金安全，请先完成
                <Link to="/realnameVerify">实名认证</Link>。
              </div>
            ) : (
              <Descriptions column={1} style={{ fontSize: 14, marginTop: 10 }}>
                <Descriptions.Item label="银行">{accountInfo?.bank_name}</Descriptions.Item>
                <Descriptions.Item label="公司">{accountInfo?.company_name}</Descriptions.Item>
                <Descriptions.Item label="账号">{accountInfo?.card_no}</Descriptions.Item>
              </Descriptions>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col style={{ paddingTop: '30px' }} span={24}>
          <div style={style}>
            <h4 style={{ fontSize: '16px' }}>可用余额(元)</h4>
            <p style={{ fontSize: '14px', color: 'rgb(136, 137, 138, 1)' }}>{userInfo?.amount}</p>
          </div>
        </Col>
      </Row>
      <Row style={{ marginBottom: '50px' }}>
        <div className={styles.arrow}></div>
        <Col span={24}>
          <div className={styles.openBallance} style={style}>
            <div className={styles.ballanceNum}>
              <h4>现金余额(元)</h4>
              <p>{userInfo?.amount}</p>
            </div>
            <div style={{ width: '50px', lineHeight: '44px' }}>-</div>
            <div className={styles.ballanceNum}>
              <h4>冻结现金资金(元)</h4>
              <p>{userInfo?.frozen_amount}</p>
            </div>
          </div>
        </Col>
      </Row>
      <Divider className={styles.balanceDivider} />
      {/* form */}
      <Form
        className={styles.balanceForm}
        layout="inline"
        ref={formRef}
        initialValues={{
          type: '1',
          between_time: defaultSelectDate,
        }}
        onFinish={onFinish}
      >
        <Row style={{ width: '100%' }}>
          <Col span={3}>
            <Form.Item name="type">
              <Select placeholder="交易类型" allowClear>
                <Option value="1">扣费</Option>
                <Option value="2">充值</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="between_time">
              <RangePicker
                disabledDate={(current) => {
                  if (!dates || dates.length === 0) {
                    return false;
                  } else {
                    const tooLate = dates[0] && current > moment(dates[0]).add(1, 'month').endOf('month');
                    const tooEarly = dates[1] && current < moment(dates[1]).subtract(1, 'month').startOf('month');
                    return tooEarly || tooLate;
                  }
                }}
                onCalendarChange={(vals) => {
                  setDates(vals);
                }}
                onOpenChange={(open) => {
                  if (open) {
                    setDates([]);
                  }
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Button size="large" style={{ width: '80px' }} type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        className={styles.tableStyle}
        rowKey={(e) => e.id}
        style={{ marginTop: '20px' }}
        pagination={{
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: false,
          onChange: (current, pageSize) => changePage(current, pageSize),
        }}
        dataSource={tableList}
        columns={columns}
        bordered={true}
      />
    </div>
  );
});
