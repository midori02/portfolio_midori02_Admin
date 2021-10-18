import {NextPage} from 'next'

import {BaseLayout} from '../../components/Layouts'
import {ContentContainer} from '../../components/containers'

const ContentEdit:NextPage = () => {
  return (
    <BaseLayout pageContents={'Edit Content'}>
      <ContentContainer/>
    </BaseLayout>
  );
};

export default ContentEdit;
