import { useState, useEffect, useRef, useCallback } from 'react';

export default function useCountDown(number = 60) {
  const [countNum, setCountNum] = useState(0);
  const [counting, setCounting] = useState(false);
  const timer = useRef();

  useEffect(() => {
    setCountNum(number);
    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  const startCount = useCallback(() => {
    counting || setCounting(true);
    timer.current = setInterval(() => {
      setCountNum((val) => {
        if (val > 1) {
          setCountNum(val - 1);
        } else {
          setCounting(false);
          setCountNum(number);
          clearInterval(timer.current);
        }
      });
    }, 1000);
  }, [countNum]);

  return {
    countNum,
    counting,
    startCount,
  };
}
