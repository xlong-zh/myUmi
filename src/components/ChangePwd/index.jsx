import { memo, useMemo, useState, useRef } from 'react';
import { Form, Button, Input, Modal, message, Col, Row } from 'antd';
import VerifyCode from '@/pages/login/components/VerifyCode';
import { validateRules, limitNum } from '@/utils/index';
import { sendVerifyCodeNoPhone, doChangePwd } from '@/services/index';

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
export default memo(function Index(props) {
  const [loading, setLoading] = useState(false);
  const verifyRef = useRef();
  const [form] = useForm();
  const { validateFields } = form;

  const formList = useMemo(
    () => [
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
      {
        label: '设置密码',
        name: 'password',
        rules: [
          {
            validator: validateRules(/^[0-9A-Za-z]{6,20}$/, '请输入密码!', '密码为6-20位字符'),
          },
        ],
        content: <Input type="password" maxLength={20} autoComplete="off" />,
      },
    ],
    [],
  );

  const sendCode = async () => {
    try {
      await validateFields(['password']);
      verifyRef.current?.setLoading(true);
      const { msg } = await sendVerifyCodeNoPhone();
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
      await doChangePwd(values);
      message.success('修改成功');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="修改密码" visible centered footer={false} {...props}>
      <div className={styles.content_box}>
        <Form form={form} layout="vertical" {...layout} onFinish={onFinish}>
          {formList.map(({ name, content, ...rest }) => (
            <Item key={name} name={name} {...rest} style={{ marginTop: 20 }}>
              {content}
            </Item>
          ))}
          <Row>
            <Col span={16} offset={4}>
              <Button type="primary" htmlType="submit" loading={loading} style={{ marginTop: 10 }}>
                确认修改
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
});
