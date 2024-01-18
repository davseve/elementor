const wpCli = require( 'node-wp-cli' );

wpCli.call( 'theme activate hello-elementor', { path: 'localhost:8888' }, function( err, resp ) {
	if ( err ) {
		throw err;
	}

	console.log( resp.message );
} );

wpCli.call( '--user=admin elementor library import-dir /var/www/html/elementor-templates', { path: 'localhost:8888' }, function( err, resp ) {
	if ( err ) {
		throw err;
	}

	console.log( resp.message );
} );

