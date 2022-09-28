import ConfigService from 'elementor/app/services/config/config-service';
import services from '@elementor/services';

describe( 'config.service.test.js', () => {
	test( 'get service should return a fulfilled request' ), async () => {
		// Arrange


		// Act
		const get = await services.configService.get;
		const result = jest.fn().mockResolvedValue( 42 );

		// Assert
		await expect( get ).resolves.toBe( 42 );
	};
} );
