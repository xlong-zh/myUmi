import { useMemo, memo, useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { validateRules, limitNum } from '@/utils/index';
import { doAuth } from '@/services/index';
import License from './License';
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
      await doAuth({ type: 1, ...values });
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
        name: 'license',
        label: '营业执照照片',
        rules: [{ required: true, message: '请上传符合大小要求及格式的图片!' }],
        content: <License />,
      },
      {
        name: 'company_name',
        label: '公司名称',
        rules: [{ required: true, message: '请输入公司名称!' }],
        content: <Input className={styles.input} autoComplete="off" />,
      },
      {
        name: 'company_address',
        label: '公司地址',
        rules: [{ required: true, message: '请输入公司地址!' }],
        content: <Input className={styles.input} autoComplete="off" />,
      },
      {
        name: 'credit_code',
        label: '统一社会信用代码',
        rules: [{ required: true, message: '请输入统一社会信用代码!' }],
        content: <Input className={styles.input} maxLength={18} autoComplete="off" />,
      },
      {
        name: 'tax_registration_no',
        label: '税务登记证编号',
        content: <Input className={styles.input} autoComplete="off" />,
      },
      {
        name: 'organization_no',
        label: '企业组织机构编号',
        content: <Input className={styles.input} autoComplete="off" />,
      },
      {
        name: 'contact_name',
        label: '联系人姓名',
        rules: [{ required: true, message: '请输入联系人姓名!' }],
        content: <Input className={styles.input} autoComplete="off" />,
      },
      {
        name: 'contact_phone',
        label: '联系人电话',
        required: true,
        getValueFromEvent: limitNum,
        rules: [{ validator: validateRules(/^[1][3,4,5,7,8,9][0-9]{9}$/) }],
        content: <Input className={styles.input} maxLength={11} autoComplete="off" />,
      },
      {
        name: 'legal_name',
        label: '法人姓名',
        content: <Input className={styles.input} autoComplete="off" />,
      },
      {
        name: 'legal_id_card',
        label: '法人身份证',
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
        实名认证类型、认证主体和发票一致，开具增值税专用发票必须为企业认证。
      </p>
      <Form form={form} {...formLayout} validateTrigger="onSubmit" className={styles.form} onFinish={onFinish}>
        {formList.map(({ name, content, ...rest }) => (
          <Item key={name} name={name} {...rest} style={{ marginBottom: 20 }}>
            {content}
          </Item>
        ))}
        <Item style={{ textAlign: 'center', width: '100%' }}>
          <Button type="primary" htmlType="submit" loading={loading} className={styles.submitBtn}>
            提交验证
          </Button>
          <p style={{ color: 'rgba(0,0,0,.65)', fontSize: 14 }}>
            请谨慎填写，确认无误后提交。如公司信息识别有误，请尝试更换照片重新上传。
          </p>
        </Item>
      </Form>
    </>
  );
});
