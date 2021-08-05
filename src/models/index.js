import { message } from 'antd';
import { getUserInfo, setInfo, getAuthInfo } from '@/services/index';

export default {
  namespace: 'app',
  state: {
    userInfo: {},
    authInfo: '',
  },
  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getUserInfo({ callback }, { put, call }) {
      try {
        const { data: authInfo } = yield call(getAuthInfo);
        const { data } = yield call(getUserInfo);
        yield put({ type: 'setState', payload: { authInfo, userInfo: data } });
        callback && callback();
      } catch {
        yield put({
          type: 'setState',
          payload: { authInfo: null, userInfo: {} },
        });
      }
    },
    *setInfo({ payload }, { put, call, select }) {
      const { userInfo } = yield select((state) => state.app);
      const { area, ...rest } = payload;
      try {
        yield call(setInfo, { ...area, ...rest });
        yield put({
          type: 'setState',
          payload: { userInfo: { ...userInfo, ...payload } },
        });
        message.success('设置成功');
      } catch (error) {
        console.log(error);
      }
    },
  },
};
