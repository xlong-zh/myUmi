import { memo, useCallback } from 'react';
import { Select } from 'antd';
import { areaData } from '@/config/areaData';

import styles from './index.less';

const { Option } = Select;

export default memo(function Index({ disabled, value = {}, onChange }) {
  const { city = '', province } = value;
  const provinceList = areaData.map(({ provinceName }) => provinceName);

  const handleChange = (val, type) => {
    const changeValue = type === 'province' ? { province: val, city: '' } : { city: val };
    onChange && onChange({ ...value, ...changeValue });
  };

  const getCity = useCallback(() => {
    const filterObj = areaData.find(({ provinceName }) => provinceName === province) || {};
    return filterObj?.citys || [];
  }, [province]);

  return (
    <div className={styles.area}>
      <Select
        disabled={disabled}
        value={province}
        style={{ width: 180, marginRight: 12 }}
        onChange={(val) => handleChange(val, 'province')}
      >
        {provinceList.map((ele) => (
          <Option key={ele}>{ele}</Option>
        ))}
      </Select>
      <Select
        style={{ width: 180 }}
        value={city}
        disabled={disabled || !province}
        onChange={(val) => handleChange(val, 'city')}
      >
        {getCity().map(({ citysName }) => (
          <Option key={citysName}>{citysName}</Option>
        ))}
      </Select>
    </div>
  );
});
