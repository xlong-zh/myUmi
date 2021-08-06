import { memo } from 'react';
import { Row, Col } from 'antd';
import { useHistory } from 'umi';
import styles from '../index.less';

export default memo(function Index(props) {
  const history = useHistory();
  const myProduct = (item, thirdItem) => {
    history.push({
      pathname: '/myProduct',
      state: {
        first_id: props.listItem.id,
        second_id: item.id,
        third_id: thirdItem.id,
      },
    });
  };
  return (
    <Row gutter={16}>
      {props.listItem?.child?.map((item, index) => {
        return (
          <Col span={6} key={item.id}>
            <div className={styles.producItem}>
              <div style={{ display: 'flex', marginBottom: '30px' }}>
                <img src={item.logo} style={{ width: '50px' }}></img>
                <h4>{item.name}</h4>
              </div>
              <Row>
                {item.child.map((thirdItem, thirdIndex) => {
                  return (
                    <Col
                      className={styles.business}
                      key={thirdItem.id}
                      span={12}
                      onClick={() => myProduct(item, thirdItem)}
                    >
                      {thirdItem.name}
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Col>
        );
      })}
    </Row>
  );
});
