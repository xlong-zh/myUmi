import { memo, useMemo, useState, useRef } from 'react';
import { useHistory, useDispatch } from 'umi';
import Cookie from 'js-cookie';
import { Form, Row, Col, Button, Input, Checkbox, message } from 'antd';
import { limitNum, validateRules } from '@/utils/index';
import { codeLogin, sendVerifyCode } from '@/services/index';
import VerifyCode from './VerifyCode';

import styles from '../index.less';

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
  const [remember, setRemember] = useState(false);
  const verifyRef = useRef();
  const [form] = useForm();
  const { validateFields } = form;
  const history = useHistory();
  const dispatch = useDispatch();

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
      console.log(err);
    } finally {
      verifyRef.current?.setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const {
        data: { usertoken },
      } = await codeLogin(values);
      message.success('登录成功');
      Cookie.set('token', usertoken, { domain: '.huarongxunfang.com' });
      // 是否记住密码
      await dispatch({
        type: 'app/setState',
        payload: { remember },
      });
      history.push('/home');
    } catch {
      Cookie.remove('token');
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
    <div style={{ marginTop: 35 }}>
      <Form form={form} layout="vertical" {...layout} onFinish={onFinish}>
        {formList.map(({ name, content, ...rest }) => (
          <Item key={name} name={name} {...rest} style={{ marginTop: 20 }}>
            {content}
          </Item>
        ))}
        <Row>
          <Col span={16} offset={4}>
            <Checkbox checked={remember} className={styles.checkbox} onChange={(e) => setRemember(e.target.checked)}>
              记住密码
            </Checkbox>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginTop: 10 }}>
              登录
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={16} offset={4}>
          <div className={styles.back_end}>
            <div onClick={() => history.push('/login/forgetPwd')}>忘记密码?</div>
            <div onClick={() => history.push('/login/register')}>立即注册</div>
          </div>
        </Col>
      </Row>
    </div>
  );
});
