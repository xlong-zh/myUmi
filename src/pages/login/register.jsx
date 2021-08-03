import { memo, useState, useMemo, useRef } from 'react';
import { useHistory, useDispatch } from 'umi';
import Cookie from 'js-cookie';
import { Button, Form, Input, Checkbox, Row, Col, message } from 'antd';
import { register, sendVerifyCode } from '@/services/index';
import { validateRules, limitNum } from '@/utils/index';
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
  const [canRegister, setCanRegister] = useState(false);
  const verifyRef = useRef();
  const history = useHistory();
  const [form] = useForm();
  const { validateFields } = form;
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
      console.error(err);
    } finally {
      verifyRef.current?.setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      const {
        data: { usertoken },
      } = await register({ ...values });
      message.success('注册成功!');
      Cookie.set('token', 'usertoken');
      await dispatch({
        type: 'app/setState',
        payload: { remember: true },
      });
      history.push('/home');
    } catch (e) {
      console.log(e);
    }
  };

  const formList = useMemo(
    () => [
      {
        label: '手机号',
        name: 'phone',
        getValueFromEvent: limitNum,
        rules: [{ validator: validateRules(/^[1][3,4,5,7,8,9][0-9]{9}$/) }],
        content: <Input className={styles.input} maxLength={11} autoComplete="off" />,
      },
      {
        label: '用户昵称',
        name: 'username',
        rules: [
          {
            validator: validateRules(/^[0-9a-zA-Z\u4e00-\u9fa5]*$/, '请输入用户昵称!', '用户昵称只接受中英文和数字'),
          },
        ],
        content: <Input className={styles.input} maxLength={50} autoComplete="off" />,
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
      {
        label: '设置密码',
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
    <div className={styles.content_box}>
      <div className={styles.register_h2}>注册</div>
      <Form form={form} layout="vertical" {...layout} onFinish={onFinish}>
        {formList.map(({ name, content, ...rest }) => (
          <Item key={name} name={name} {...rest}>
            {content}
          </Item>
        ))}
        <Row>
          <Col span={16} offset={4}>
            <Checkbox checked={canRegister} onChange={(e) => setCanRegister(e.target.checked)}>
              我已阅读并同意《福禄开放平台用户注册协议》
            </Checkbox>
            <Button type="primary" htmlType="submit" style={{ marginTop: 10 }} disabled={!canRegister}>
              立即注册
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={16} offset={4}>
          <div className={styles.back_end}>
            <div></div>
            <div onClick={() => history.push('/login')}>已有账号, 直接登录&gt;</div>
          </div>
        </Col>
      </Row>
    </div>
  );
});
