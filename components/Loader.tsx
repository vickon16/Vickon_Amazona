import { memo } from 'react';
import { InfinitySpin } from 'react-loader-spinner';

const Loader = () => {
  return <InfinitySpin width="150" color="#4fa94d" />;
}

export default memo(Loader)