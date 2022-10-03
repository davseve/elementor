import Favorites from './pages/favorites/favorites';
import Index from './pages/index';
import Overview from './pages/overview/overview';
import Preview from './pages/preview/preview';
import { LastFilterProvider } from './context/last-filter-context';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Router } from '@reach/router';
import { SettingsProvider } from './context/settings-context';
import services from '@elementor/services';
// import { configService } from 'elementor-app/services';
const queryClient = new QueryClient( {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			staleTime: 1000 * 60 * 30, // 30 minutes
		},
	},
} );

export default function App() {
	const config = services.configService.get( 'kit-library' );
	return (
		<div className="e-kit-library">
			<QueryClientProvider client={ queryClient }>
				<SettingsProvider value={ config }>
					<LastFilterProvider>
						<Router>
							<Index path="/" />
							<Favorites path="/favorites" />
							<Preview path="/preview/:id" />
							<Overview path="/overview/:id" />
						</Router>
					</LastFilterProvider>
				</SettingsProvider>
				{ elementorCommon.config.isElementorDebug && <ReactQueryDevtools initialIsOpen={ false } /> }
			</QueryClientProvider>
		</div>
	);
}
