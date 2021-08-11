import { memo, useState, useRef, useEffect } from 'react';
import { useLocation } from 'umi';
import { Row, Col, Divider, Button, Select, Form, Input, Table, Space, Tag } from 'antd';
import { productSort, myProduct } from '@/services/index';
import styles from './index.less';

const { Option } = Select;

const columns = [
  {
    title: '商品编号',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '面值(元)',
    dataIndex: 'face_value',
    key: 'face_value',
    align: 'center',
  },
  {
    title: '商品类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    render: (text) => (
      <span>
        <Tag color={'green'}>{text == 1 ? '直冲' : text == 2 ? '卡密' : '链接&二维码'}</Tag>
      </span>
    ),
  },
  {
    title: '结算类型',
    dataIndex: 'mtype',
    key: 'mtype',
    align: 'center',
    render: (text) => (text == 1 ? '单价' : text == 2 ? <span style={{ color: 'red' }}>折扣</span> : '--'),
  },
  {
    title: '单价&折扣',
    dataIndex: 'value',
    key: 'value',
    align: 'center',
    render: (text, { mtype }) => (mtype == 2 ? <span style={{ color: 'red' }}>{text}</span> : text),
  },
];

export default memo(function Index(props) {
  const formRef = useRef();
  const { state } = useLocation();

  const [selectInfo, setSelectInfo] = useState([]);
  const [secondInfo, setSecondInfo] = useState([]);
  const [thirdInfo, setThirdInfo] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });

  useEffect(() => {
    const defInfo = formRef.current.getFieldsValue();
    getProductSort();
    getTableData({ ...defInfo, ...pagination });
  }, []);

  const getProductSort = async () => {
    try {
      const res = await productSort();
      setSelectInfo(res.data);
      console.log(props);
      if (state) {
        const { first_id, second_id } = state;
        firstChange(first_id);
        secondChange(second_id);
        formRef.current.setFieldsValue(state);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTableData = async (form) => {
    try {
      const res = await myProduct(form);
      setTableList(res.data.data);
      setPagination((val) => ({ ...val, total: res.data.count }));
    } catch (error) {
      console.log(error);
    }
  };
  const firstChange = (val1) => {
    const second = selectInfo.filter((item) => item.id == val1)[0]?.child;
    setSecondInfo(second);
    setThirdInfo([]);
    formRef.current.setFieldsValue({ second_id: [], third_id: [] });
  };
  const secondChange = (val2) => {
    const third = secondInfo?.filter((item) => item.id == val2)[0]?.child;
    setThirdInfo(third);
    formRef.current.setFieldsValue({ third_id: [] });
  };
  const onFinish = async (values) => {
    getTableData({
      ...values,
      ...pagination,
    });
  };
  const changePage = (current, pageSize) => {
    const defVal = formRef.current.getFieldsValue();
    setPagination((val) => ({ ...val, page: current, limit: pageSize }));
    getTableData({
      ...defVal,
      page: current,
      limit: pageSize,
    });
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <Form className={styles.balanceForm} layout="inline" ref={formRef} initialValues={state} onFinish={onFinish}>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item label="一级分类" name="first_id">
              <Select placeholder="请选择" allowClear onChange={firstChange}>
                {selectInfo.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="二级分类" name="second_id">
              <Select placeholder="请选择" allowClear onChange={secondChange}>
                {secondInfo?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="三级分类" name="third_id">
              <Select placeholder="请选择" allowClear>
                {thirdInfo?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="商品类型" name="type">
              <Select placeholder="请选择" allowClear>
                <Option value="1">直充</Option>
                <Option value="2">卡密</Option>
                <Option value="3">链接&二维码</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} style={{ paddingTop: '0' }}>
            <Form.Item label="商品面值" name="face_value">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={6} style={{ paddingTop: '0' }}>
            <Form.Item label="商品名称" name="name">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={6} style={{ paddingTop: '0' }}>
            <Form.Item label="商品编号" name="product_id">
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button size="large" style={{ width: '80px' }} type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Table
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
