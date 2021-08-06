import { memo, useState, useEffect } from 'react';
import { productSort } from '@/services/index';
import { Row, Col, Tooltip } from 'antd';
import GoodsList from './components/goodsList';
import styles from './index.less';

export default memo(function Index() {
  const [tableList, setTableList] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getProductSort();
  }, []);

  const getProductSort = async () => {
    try {
      const res = await productSort();
      setTableList(res.data || []);
      setListItem(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getListTerm = (item, index) => {
    console.log(item.id);
    setListItem(item);
    setCurrentIndex(index);
  };

  return (
    <div>
      <div style={{ background: '#fff', marginBottom: '30px', padding: '20px' }}>
        <Row style={{ marginBottom: '20px' }}>
          <Col span={12} className={styles.serchTitle}>
            所有分类
          </Col>
        </Row>
        <Row className={styles.productType}>
          {tableList.map((item, index) => {
            return (
              <Col
                style={{
                  color: index == currentIndex ? '#1890ff' : '#444',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
                span={2}
                key={item.id}
                onClick={() => getListTerm(item, index)}
              >
                <Tooltip placement="top" title={item.name}>
                  <span style={{ cursor: 'pointer' }}>{item.name}</span>
                </Tooltip>
              </Col>
            );
          })}
        </Row>
      </div>
      <div className={styles.producList}>
        <GoodsList listItem={listItem} currentIndex={currentIndex} />
      </div>
    </div>
  );
});
