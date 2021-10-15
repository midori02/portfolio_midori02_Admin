import {NextPage} from 'next'

import {BaseLayout} from '../../components/Layouts'
import {ContentContainer} from '../../components/containers'

const Content:NextPage = () => {
  return (
    <BaseLayout pageContents={'Add Content'}>
      <ContentContainer/>
    </BaseLayout>
  );
};

export default Content;
