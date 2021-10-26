import React from 'react';

import {BaseLayout} from '../../components/Layouts'
import {SettingContainer} from '../../components/containers'

const section = () => {
  return (
    <BaseLayout pageContents={'Settings'}>
      <SettingContainer/>
    </BaseLayout>
  );
};

export default section;
