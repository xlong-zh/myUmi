import { memo, useState, useMemo, useRef } from 'react';
import { Link, useHistory } from 'umi';
import { Button, Form, Input, Row, Col, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { validateRules, limitNum } from '@/utils/index';
import { sendVerifyCode, updatePwd } from '@/services/index';
import VerifyCode from './components/VerifyCode';

import styles from './index.less';

const { useForm, Item } = Form;
const layout = {
  labelCol: {
    span: 8,
    offset: 4,
  },
  wrapperCol: {
    span: 16,
    offset: 4,
  },
};

export default memo(function Index() {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const { validateFields } = form;
  const verifyRef = useRef();
  const history = useHistory();

  const sendCode = async () => {
    try {
      const { phone } = await validateFields(['phone']);
      verifyRef.current?.setLoading(true);
      const { msg } = await sendVerifyCode({
        phone,
      });
      verifyRef.current?.count();
      message.success(msg);
    } catch (err) {
      console.error(err);
    } finally {
      verifyRef.current?.setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updatePwd(values);
      message.success('修改成功');
      history.push('/login');
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const formList = useMemo(
    () => [
      {
        label: '手机号',
        name: 'phone',
        getValueFromEvent: limitNum,
        rules: [
          {
            validator: validateRules(/^[1][3,4,5,7,8,9][0-9]{9}$/, '请输入手机号!'),
          },
        ],
        content: <Input className={styles.input} maxLength={11} autoComplete="off" />,
      },
      {
        label: '密码',
        name: 'password',
        rules: [
          {
            validator: validateRules(/^[0-9A-Za-z]{6,20}$/, '请输入密码!', '密码为6-20位字符'),
          },
        ],
        content: <Input className={styles.input} type="password" maxLength={20} autoComplete="off" />,
      },
      {
        label: '验证码',
        name: 'code',
        getValueFromEvent: limitNum,
        rules: [
          {
            validator: validateRules(/^\d{4}$/, '请输入验证码', '验证码由4位数字组成'),
          },
        ],
        content: <VerifyCode sendCode={sendCode} cref={verifyRef} />,
      },
    ],
    [],
  );

  return (
    <div style={{ marginTop: 35 }} className={styles.content_box}>
      <div className={styles.forgetTitle}>
        <Link to="/login">
          <LeftOutlined />
        </Link>
        找回密码
      </div>
      <Form form={form} layout="vertical" {...layout} onFinish={onFinish}>
        {formList.map(({ name, content, ...rest }) => (
          <Item key={name} name={name} {...rest} style={{ marginTop: 20 }}>
            {content}
          </Item>
        ))}
        <Row style={{ marginBottom: 20 }}>
          <Col span={16} offset={4}>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginTop: 10 }}>
              确认更改
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
});
