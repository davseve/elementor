import { QueryClient, QueryClientProvider } from 'react-query';

import ContextProvider from './context/context-provider';
import { LocationProvider, Router } from '@reach/router';
import router from '@elementor/router';

import ExportKit from './pages/export/export-kit/export-kit';
import ExportComplete from './pages/export/export-complete/export-complete';
import ExportPlugins from './pages/export/export-plugins/export-plugins';
import ExportProcess from './pages/export/export-process/export-process';

const queryClient = new QueryClient();

export default function Export() {
	return (
		<QueryClientProvider client={ queryClient }>
			<ContextProvider>
				<LocationProvider history={ router.appHistory }>
					<Router>
						<ExportComplete path="complete" />
						<ExportPlugins path="plugins" />
						<ExportProcess path="process" />
						<ExportKit default />
					</Router>
				</LocationProvider>
			</ContextProvider>
		</QueryClientProvider>
	);
}
