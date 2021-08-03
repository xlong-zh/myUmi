import { memo, useMemo, useState } from 'react';
import { useHistory, useDispatch } from 'umi';
import Cookie from 'js-cookie';
import { Form, Row, Col, Button, Input, Checkbox, message } from 'antd';
import { limitNum, validateRules } from '@/utils/index';
import { pwdLogin } from '@/services/index';

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
  const [form] = useForm();
  const history = useHistory();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const {
        data: { usertoken },
      } = await pwdLogin(values);
      message.success('登录成功');
      Cookie.set('token', usertoken, { domain: '.huarongxunfang.com' });
      // 是否记住密码
      dispatch({ type: 'app/setState', payload: { remember } });
      history.push('/home');
    } catch (e) {
      Cookie.remove('token');
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
