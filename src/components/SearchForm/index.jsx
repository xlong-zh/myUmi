import { memo, useImperativeHandle } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';

import styles from './index.less';

const { useForm, Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default memo(function Index({ onFinish, cref, formSetting = [] }) {
  const [form] = useForm();
  const { getFieldsValue } = form;

  useImperativeHandle(cref, () => {
    return {
      getSearchValues: () => handleData(getFieldsValue()),
    };
  });

  const getComp = (type, props) => {
    const { options = [], ...rest } = props;
    switch (type) {
      case 'select':
        return (
          <Select style={{ height: '36px' }} {...rest}>
            {options.map(({ value, label }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        );
      case 'input':
        return <Input {...rest} />;
      case 'rangePicker':
        return <RangePicker {...rest} />;
      default:
        break;
    }
  };

  const handleData = (data) => {
    const newData = {};
    Object.keys(data).forEach((item) => {
      if (data[item]) {
        newData[item] = data[item];
      }
    });
    return newData;
  };

  return (
    <Form form={form} className={styles.form} onFinish={(values) => onFinish(handleData(values))}>
      <Row align="middle">
        {formSetting.map(({ name, type, initialValue, label, colProps = {}, compProps = {} }) => (
          <Col span={6} key={name} style={{ padding: '0 12px', marginBottom: 16 }} {...colProps}>
            <Item name={name} label={label} initialValue={initialValue}>
              {getComp(type, compProps)}
            </Item>
          </Col>
        ))}
        <Col span={6} style={{ padding: '0 12px', marginBottom: 16 }}>
          <Button type="primary" htmlType="submit" className={styles.btn}>
            查询
          </Button>
        </Col>
      </Row>
    </Form>
  );
});
