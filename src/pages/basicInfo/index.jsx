import { memo, useState, useMemo, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { setInfo } from '@/services/index';
import Area from './components/Area';
import styles from './index.less';
import FormList from 'antd/lib/form/FormList';

const { useForm, Item } = Form;

export default memo(function Index() {
  const [type, setType] = useState('');
  const [warn, setWarn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const { getFieldsValue, setFieldsValue } = form;
  const { userInfo = {} } = useSelector((state) => state.app, shallowEqual);
  const dispatch = useDispatch();
  const layout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 18,
    },
  };

  useEffect(() => {
    if (address) {
      const { address = '', area, email, qq } = userInfo;
      setFieldsValue({ address, area: { ...area }, email, qq });
      setType('showing');
    } else {
      setType('editing');
    }
  }, [userInfo]);

  const handleSubmit = async () => {
    const data = getFieldsValue();
    const validateStatus = validate(data);
    if (validateStatus) {
      const { area, ...rest } = data;
      try {
        setLoading(true);
        await dispatch({
          type: 'app/setInfo',
          payload: {
            ...area,
            ...rest,
          },
        });
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  };

  const formList = useMemo(
    () => [
      {
        name: 'area',
        label: '所在地区',
        content: <Area disabled={type === 'showing'} />,
      },
      {
        name: 'address',
        label: '街道地址',
        content: (
          <Input disabled={type === 'showing'} placeholder="请输入详细地址" style={{ width: 300 }} autoComplete="off" />
        ),
        warnText: '请输入您的街道地址',
      },
      {
        name: 'email',
        label: '电子邮件',
        content: <Input disabled={type === 'showing'} placeholder="请填写" style={{ width: 300 }} autoComplete="off" />,
        warnText: '请填写正确的邮箱地址',
      },
      {
        name: 'qq',
        label: 'QQ',
        content: <Input disabled={type === 'showing'} placeholder="请填写" style={{ width: 300 }} autoComplete="off" />,
        warnText: 'QQ号只能为数字，长度在5-10位之间',
      },
    ],
    [type],
  );

  return (
    <div style={{ padding: '40px 60px' }}>
      <div className={styles.contactInfo}>联系信息</div>
      <Form {...layout} form={form} className={styles.form}>
        {formList.map(({ content, warnText, name, label }) => (
          <div key={name} style={{ position: 'relative' }}>
            <Item name={name} label={label}>
              {content}
            </Item>
            {warn.includes(name) && <span className={styles.warnText}>{warnText || ''}</span>}
          </div>
        ))}
        <Button
          type="primary"
          loading={loading}
          onClick={type === 'editing' ? handleSubmit : () => setType('editing')}
          style={{ marginBottom: 12 }}
        >
          {type === 'editing' ? '保存' : type === 'showing' ? '修改' : ''}
        </Button>
      </Form>
    </div>
  );
});
