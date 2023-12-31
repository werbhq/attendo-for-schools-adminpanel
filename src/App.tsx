import { Admin, defaultTheme, Resource } from 'react-admin';
import red from '@mui/material/colors/red';
import Classroom from './pages/classroom/Index';
import DashBoard from './pages/dashboard/Dashboard';
import { RaDatagrid, RaList } from 'components/ui/style';
import AuthTeachers from './pages/authTeachers';
import { getCustomAuthProvider, isProd } from './provider/firebase';
import { CustomLayout } from './components/ui/Layout';
import { customQueryClient } from './provider/queryClient';
import useDataProviderCustom from 'provider/hook/useDataProviderCustom';

const myTheme = {
    ...defaultTheme,
    palette: {
        primary: {
            main: '#179F97',
        },
        secondary: {
            main: isProd ? '#179F97' : '#000',
        },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        fontFamily: ['Poppins', 'sans-serif'].join(','),
    },
    components: {
        ...defaultTheme.components,
        RaDatagrid,
        RaList,
    },
};

const App = () => {
    const { dataProvider, initializeDataProvider } = useDataProviderCustom(customQueryClient);
    const authProvider = getCustomAuthProvider(initializeDataProvider);

    return (
        <Admin
            title="Attendo Admin"
            theme={myTheme}
            authProvider={authProvider}
            dataProvider={dataProvider}
            queryClient={customQueryClient}
            dashboard={DashBoard}
            layout={CustomLayout}
        >
            <Resource {...AuthTeachers} />
            <Resource {...Classroom} />
            {/* TODO: ADD ATTENDANCE RESOURCE*/}
        </Admin>
    );
};

export default App;
