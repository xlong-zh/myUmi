import { Spin } from 'antd';
export default () => (
  <div
    style={{
      left: 0,
      right: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed˝',
    }}
  >
    <Spin />
  </div>
);
