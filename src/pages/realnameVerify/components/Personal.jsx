import { memo, useMemo, useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { doAuth } from '@/services/index';
import { validateRules, limitNum } from '@/utils/index';
import IdcardPic from './IdcardPic';
import styles from './index.less';

const { useForm, Item } = Form;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export default memo(function Index({ info, flush }) {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const { setFieldsValue } = form;

  useEffect(() => {
    if (info) {
      setFieldsValue({ ...info });
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await doAuth({ type: 2, ...values });
      message.success('提交成功');
      flush();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const formList = useMemo(
    () => [
      {
        label: '身份证正反照',
        children: [
          {
            name: 'id_card_a',
            rules: [{ required: true, message: '请上传身份证头像面!' }],
            content: <IdcardPic type="头像" />,
          },
          {
            name: 'id_card_b',
            rules: [{ required: true, message: '请上传身份证国徽面!' }],
            content: <IdcardPic type="国徽" />,
          },
        ],
      },
      {
        name: 'contact_name',
        label: '姓名',
        rules: [{ required: true, message: '请输入姓名!' }],
        content: <Input className={styles.input} autoComplete="off" />,
      },
      {
        name: 'contact_phone',
        label: '电话',
        required: true,
        getValueFromEvent: limitNum,
        rules: [{ validator: validateRules(/^[1][3,4,5,7,8,9][0-9]{9}$/) }],
        content: <Input className={styles.input} maxLength={11} autoComplete="off" />,
      },
      {
        name: 'id_card',
        label: '身份证号码',
        rules: [{ required: true, message: '请输入身份证号码!' }],
        content: <Input className={styles.input} autoComplete="off" />,
      },
    ],
    [],
  );
  return (
    <>
      <p className={styles.tips}>
        提示：实名认证决定了账号归属。如企业使用的账号进行个人实名认证，在人员变动交接账号或账号下财产出现纠纷时，可能对个人/企业都带来麻烦。
        <br />
        实名认证类型、认证主体和发票一致，个人认证只能开具增值税普通发票。
      </p>
      <Form form={form} onFinish={onFinish} {...formLayout} className={styles.form}>
        {formList.map(({ name, children, content, ...rest }) =>
          children ? (
            <Item key={rest.label} required label={rest.label}>
              {children.map((item) => (
                <Item key={item.name} name={item.name} rules={item.rules} className={styles.idcardPicWrapper}>
                  {item.content}
                </Item>
              ))}
              <p style={{ marginTop: 10 }}>图片大小不要超过2M支持PNG，JPG格式</p>
            </Item>
          ) : (
            <Item key={name} name={name} {...rest}>
              {content}
            </Item>
          ),
        )}
        <Item style={{ textAlign: 'center', width: '100%' }}>
          <Button type="primary" htmlType="submit" loading={loading} className={styles.submitBtn}>
            提交验证
          </Button>
          <p style={{ color: 'rgba(0,0,0,.65)', fontSize: 14 }}>
            请谨慎填写，确认无误后提交。如信息识别有误，请尝试更换照片重新上传。
          </p>
        </Item>
      </Form>
    </>
  );
});
