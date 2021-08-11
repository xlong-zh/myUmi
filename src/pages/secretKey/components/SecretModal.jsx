import { memo, useRef, useState } from 'react';
import { Form, Modal, message } from 'antd';
import { useSelector, shallowEqual } from 'react-redux';
import VerifyCode from '@/pages/login/components/VerifyCode';
import { validateRules, limitNum } from '@/utils/index';
import { sendVerifyCodeNoPhone, getSecret as showSecret, resetSecret } from '@/services/index';
import styles from '../index.less';

const { useForm, Item } = Form;
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

const SecretModal = memo(({ getSecret, type, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const verifyRef = useRef();
  const [form] = useForm();
  const { validateFields } = form;
  const {
    userInfo: { phone },
  } = useSelector((state) => state.app, shallowEqual);

  const handleOk = async () => {
    setLoading(true);
    try {
      const asyncFn = type === 'show' ? showSecret : resetSecret;
      const { code } = await validateFields(['code']);
      const {
        data: { secret },
      } = await asyncFn({ code });
      getSecret(secret);
    } catch (error) {
      console.log(error);
    }
  };

  const sendCode = async () => {
    try {
      verifyRef.current?.setLoading(true);
      const { msg } = await sendVerifyCodeNoPhone();
      verifyRef.current?.count();
      message.success(msg);
    } catch (err) {
      console.error(err);
    }
    verifyRef.current?.setLoading(false);
  };

  return (
    <Modal
      visible
      width={500}
      title={`${type === 'show' ? '显示' : '重置'}应用密钥`}
      onOk={handleOk}
      {...rest}
      confirmLoading={loading}
      className={styles.modal}
    >
      <Form form={form} {...layout}>
        <Item label="手机号" className={styles.formItem}>
          {phone}
        </Item>
        <Item
          label="验证码"
          name="code"
          className={styles.formItem}
          getValueFromEvent={limitNum}
          rules={[
            {
              validator: validateRules(/^\d{4}$/, '请输入验证码', '验证码由4位数字组成'),
            },
          ]}
        >
          <VerifyCode sendCode={sendCode} cref={verifyRef} />
        </Item>
      </Form>
    </Modal>
  );
});

export default SecretModal;
