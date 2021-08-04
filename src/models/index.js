import { message } from 'antd';
import { getUserInfo, setInfo, getAuthInfo } from '@/services/index';

export default {
  namespace: 'app',
  state: {
    loading: false,
    userInfo: {},
    authInfo: '',
    remember: false,
  },
  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getUserInfo(_, { put, call }) {
      try {
        yield put({ type: 'setState', payload: { loading: true } });
        const { data: authInfo } = yield call(getAuthInfo);
        const { data } = yield call(getUserInfo);
        yield put({ type: 'setState', payload: { authInfo, userInfo: data } });
      } catch {
        yield put({
          type: 'setState',
          payload: { authInfo: null, userInfo: {} },
        });
      }
      yield put({ type: 'setState', payload: { loading: false } });
    },
    *setInfo({ payload }, { put, call, select }) {
      const userInfo = yield select((state) => state.userInfo);
      yield put({ type: 'setState', payload: { loading: true } });
      try {
        yield call(setInfo, payload);
        yield put({
          type: 'setState',
          payload: { loading: false, userInfo: { ...userInfo, ...payload } },
        });
        message.success('设置成功');
      } catch (error) {
        yield put({ type: 'setState', payload: { loading: false } });
      }
    },
  },
};
