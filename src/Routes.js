import { BrowserRouter as Router,  Route } from 'react-router-dom';
import TableAdmin from './components/TableAdmin';
import BasicTable from './components/Table';

export const Routes = () => {
    return (
        <Routes>
          <Switch>
            <Route path="/" element={<BasicTable />} />
            <Route path="/Admin" element={<TableAdmin />} />
          </Switch>
        </Routes>
        )
}