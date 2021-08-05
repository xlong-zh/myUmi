import { memo } from 'react';
import { useDispatch } from 'umi';
import { Upload, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadPic } from '@/services/index';
import { getBase64 } from '@/utils/index';
import styles from './index.less';

export default memo(function Index({ value, style = {}, getUrl, size = '2M', ...rest }) {
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    const { file } = e;
    const limitSize = parseInt(size, 10) * 1024 * 1024;
    if (file.size > limitSize) {
      message.warn('图片大小必须小于2M');
    } else {
      const base64Url = (await getBase64(file)) || '';
      dispatch({
        type: 'app/setState',
        payload: { loading: true },
      });
      try {
        const res = await uploadPic({
          img_data: base64Url,
        });
        getUrl(res?.data?.url);
      } catch {
        getUrl('');
      }
      dispatch({
        type: 'app/setState',
        payload: { loading: false },
      });
    }
  };

  return (
    <div style={style}>
      <div className={styles.picBox}>{value ? <img src={value} alt="" /> : <span>暂无图片</span>}</div>
      <Upload
        maxCount={1}
        className={styles.upload}
        accept=".png,.jpg,.jpeg"
        beforeUpload={() => false}
        onChange={handleChange}
        {...rest}
      >
        <Button icon={<PlusOutlined />} className={styles.uploadBtn} type="primary">
          上传照片
        </Button>
      </Upload>
    </div>
  );
});
