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
            area,
            ...rest,
          },
        });
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  };

  const validate = (data) => {
    const ruleObj = {
      area: /\S/,
      address: /\S/,
      email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
      qq: /^\d{5,10}$/,
    };
    const keysArr = Object.keys(data) || [];
    let status = true;
    for (const i of keysArr) {
      if (!data[i] || !ruleObj[i].test(data[i])) {
        setWarn((val) => [...val, i]);
        status = false;
      }
    }
    return status;
  };

  const formList = useMemo(
    () => [
      {
        name: 'area',
        label: '????????????',
        content: <Area disabled={type === 'showing'} />,
      },
      {
        name: 'address',
        label: '????????????',
        content: (
          <Input disabled={type === 'showing'} placeholder="?????????????????????" style={{ width: 300 }} autoComplete="off" />
        ),
        warnText: '???????????????????????????',
      },
      {
        name: 'email',
        label: '????????????',
        content: <Input disabled={type === 'showing'} placeholder="?????????" style={{ width: 300 }} autoComplete="off" />,
        warnText: '??????????????????????????????',
      },
      {
        name: 'qq',
        label: 'QQ',
        content: <Input disabled={type === 'showing'} placeholder="?????????" style={{ width: 300 }} autoComplete="off" />,
        warnText: 'QQ??????????????????????????????5-10?????????',
      },
    ],
    [type],
  );

  return (
    <div style={{ padding: '40px 60px' }}>
      <div className={styles.contactInfo}>????????????</div>
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
          {type === 'editing' ? '??????' : type === 'showing' ? '??????' : ''}
        </Button>
      </Form>
    </div>
  );
});
