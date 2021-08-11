import { memo, useState, useEffect, useMemo } from 'react';
import { Card, Modal, message, Input, Form, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getSetting, setNotifyUrl, setIps } from '@/services/index';
import styles from './index.less';

const { useForm, Item } = Form;
const layout = {
  wrapperCol: { span: 16 },
  labelCol: { span: 6 },
};
export default memo(function Index() {
  const [asyncUrl, setAsyncUrl] = useState('');
  const [ip, setIp] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const [form] = useForm();
  const { validateFields, resetFields } = form;

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    try {
      const {
        data: { notify_url, ip },
      } = await getSetting({ type: 2 });
      setAsyncUrl(notify_url || '');
      setIp(ip);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSet = (t) => {
    setType(t);
  };

  const title = useMemo(() => (type === 'async' ? '订单回调地址' : 'IP白名单'), [type]);

  const handleOk = async () => {
    try {
      const { inputValue } = await validateFields(['inputValue']);
      setLoading(true);
      if (type === 'ip') {
        await setIps({
          ip: inputValue,
        });
      } else {
        await setNotifyUrl({
          notify_url: inputValue,
        });
      }
      message.success('配置成功');
      setType('');
      resetFields();
      getInfo();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px 30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Card
          title={
            <>
              <span>订单回调地址</span>
              <Tooltip title="商户下单后异步通知回调地址">
                <QuestionCircleOutlined style={{ marginLeft: 10 }} />
              </Tooltip>
            </>
          }
          actions={[<span onClick={() => handleSet('async')}>配置</span>]}
          className={styles.card}
        >
          {asyncUrl}
        </Card>
        <Card
          title={
            <>
              <span>IP白名单</span>
              <Tooltip title="配置IP白名单后方可访问接口，支持多个ip地址，每行一个">
                <QuestionCircleOutlined style={{ marginLeft: 10 }} />
              </Tooltip>
            </>
          }
          actions={[<span onClick={() => handleSet('ip')}>配置</span>]}
          className={styles.card}
        >
          {(ip.split('\n') || []).map((ele) => (
            <p key={ele}>{ele}</p>
          ))}
        </Card>
      </div>
      {type !== '' && (
        <Modal
          visible
          title={title}
          confirmLoading={loading}
          onCancel={() => {
            setType('');
            resetFields();
          }}
          onOk={handleOk}
        >
          <Form form={form} className={styles.form} {...layout}>
            <Item
              name="inputValue"
              label={title}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject(new Error(`请输入${title}`));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {type === 'ip' ? <Input.TextArea /> : <Input />}
            </Item>
          </Form>
        </Modal>
      )}
    </div>
  );
});
