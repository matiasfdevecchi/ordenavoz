import { Content } from '../../../_metronic/layout/components/Content';
import { useGetWebConfig } from '../../../api/web-configs';
import DefaultPage from '../../../components/DefaultPage';
import WebConfigForm from './components/WebConfigForm';

const WebConfigsPage = () => {
  const { data, isLoading } = useGetWebConfig();

  return (
    <Content>
      <DefaultPage
        title='Configuración'
        isLoading={isLoading} >
        {data && <WebConfigForm webConfig={data} />}
      </DefaultPage>
    </Content>
  )
}

export default WebConfigsPage;