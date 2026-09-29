<?php
namespace Elementor\Testing\Includes\Libraries;

use ElementorEditorTesting\Elementor_Test_Base;

class Test_BFI_Thumb extends Elementor_Test_Base {

	private $upload_dir;
	private $upload_url;
	private $test_image_path;

	public function setUp(): void {
		parent::setUp();

		require_once ELEMENTOR_PATH . 'includes/libraries/bfi-thumb/bfi-thumb.php';

		$upload_info = wp_upload_dir();
		$this->upload_dir = $upload_info['basedir'];
		$this->upload_url = $upload_info['baseurl'];

		$this->test_image_path = $this->upload_dir . '/test-image.jpg';
		$this->create_test_image( $this->test_image_path );
	}

	public function tearDown(): void {
		if ( file_exists( $this->test_image_path ) ) {
			@unlink( $this->test_image_path );
		}

		$thumb_dir = $this->upload_dir . '/elementor/thumbs';
		if ( is_dir( $thumb_dir ) ) {
			$files = glob( $thumb_dir . '/*' );
			foreach ( $files as $file ) {
				if ( is_file( $file ) ) {
					@unlink( $file );
				}
			}
		}

		parent::tearDown();
	}

	public function test_rejects_phar_wrapper() {
		$result = bfi_thumb( 'phar://malicious.phar/image.jpg', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_php_wrapper() {
		$result = bfi_thumb( 'php://filter/resource=image.jpg', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_data_wrapper() {
		$result = bfi_thumb( 'data://text/plain;base64,SGVsbG8=', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_expect_wrapper() {
		$result = bfi_thumb( 'expect://command', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_zip_wrapper() {
		$result = bfi_thumb( 'zip://archive.zip#image.jpg', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_glob_wrapper() {
		$result = bfi_thumb( 'glob://images/*.jpg', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_compress_zlib_wrapper() {
		$result = bfi_thumb( 'compress.zlib://file.gz', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_compress_bzip2_wrapper() {
		$result = bfi_thumb( 'compress.bzip2://file.bz2', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_null_url() {
		$result = bfi_thumb( null, [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_empty_url() {
		$result = bfi_thumb( '', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_whitespace_phar_wrapper() {
		$result = bfi_thumb( '  phar://malicious.phar/image.jpg', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_case_insensitive_phar() {
		$result = bfi_thumb( 'PHAR://malicious.phar/image.jpg', [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_returns_original_url_for_external_url() {
		$external_url = 'https://example.com/image.jpg';
		$result = bfi_thumb( $external_url, [ 'width' => 100 ] );

		$this->assertSame( $external_url, $result );
	}

	public function test_returns_original_url_for_path_outside_uploads() {
		$outside_path = '/tmp/image.jpg';
		$result = bfi_thumb( $outside_path, [ 'width' => 100 ] );

		$this->assertSame( $outside_path, $result );
	}

	public function test_rejects_path_with_protocol_wrapper() {
		$url = $this->upload_url . '/test-image.jpg';
		$malicious_path = 'phar://' . str_replace( $this->upload_url, $this->upload_dir, $url );

		$result = bfi_thumb( $malicious_path, [ 'width' => 100 ] );

		$this->assertFalse( $result );
	}

	public function test_rejects_path_traversal_attempt() {
		$url = $this->upload_url . '/../../../etc/passwd';
		$result = bfi_thumb( $url, [ 'width' => 100 ] );

		$this->assertSame( $url, $result );
	}

	public function test_processes_legitimate_upload_image() {
		$url = $this->upload_url . '/test-image.jpg';
		$result = bfi_thumb( $url, [ 'width' => 100, 'height' => 100 ] );

		$this->assertNotFalse( $result );
		$this->assertIsString( $result );
		$this->assertStringContainsString( $this->upload_url, $result );
		$this->assertStringContainsString( 'elementor/thumbs', $result );
	}

	public function test_filename_sanitization_in_destination() {
		$dangerous_filename = 'test%5Bmalicious%5D.jpg';
		$dangerous_path = $this->upload_dir . '/' . $dangerous_filename;
		$this->create_test_image( $dangerous_path );

		$url = $this->upload_url . '/' . $dangerous_filename;
		$result = bfi_thumb( $url, [ 'width' => 100 ] );

		$this->assertNotFalse( $result );
		$this->assertIsString( $result );
		$this->assertStringNotContainsString( '%', $result );
		$this->assertStringNotContainsString( '[', $result );
		$this->assertStringNotContainsString( ']', $result );

		@unlink( $dangerous_path );
	}

	public function test_allows_theme_directory_images() {
		$theme_dir = get_template_directory();
		$theme_url = get_template_directory_uri();
		$theme_image_path = $theme_dir . '/test-theme-image.jpg';

		$this->create_test_image( $theme_image_path );

		$url = $theme_url . '/test-theme-image.jpg';
		$result = bfi_thumb( $url, [ 'width' => 100 ] );

		$this->assertNotFalse( $result );
		$this->assertIsString( $result );

		@unlink( $theme_image_path );
	}

	public function test_respects_param_whitelist() {
		$url = $this->upload_url . '/test-image.jpg';

		$result = bfi_thumb( $url, [
			'width' => 100,
			'height' => 100,
			'dangerous_param' => 'should_be_ignored',
		] );

		$this->assertNotFalse( $result );
		$this->assertIsString( $result );
	}

	public function test_rejects_symlink_outside_allowed_path() {
		$symlink_path = $this->upload_dir . '/symlink-test.jpg';
		$target_path = '/tmp/outside-target.jpg';

		$this->create_test_image( $target_path );

		if ( function_exists( 'symlink' ) && ! file_exists( $symlink_path ) && @symlink( $target_path, $symlink_path ) ) {
			$url = $this->upload_url . '/symlink-test.jpg';
			$result = bfi_thumb( $url, [ 'width' => 100 ] );

			$this->assertSame( $url, $result );

			@unlink( $symlink_path );
			@unlink( $target_path );
		} else {
			$this->markTestSkipped( 'Symlink creation not available or failed' );
		}
	}

	private function create_test_image( $path ) {
		$width = 200;
		$height = 200;
		$image = imagecreatetruecolor( $width, $height );

		$bg_color = imagecolorallocate( $image, 255, 255, 255 );
		imagefill( $image, 0, 0, $bg_color );

		$text_color = imagecolorallocate( $image, 0, 0, 0 );
		imagestring( $image, 5, 50, 90, 'Test Image', $text_color );

		imagejpeg( $image, $path, 90 );
		imagedestroy( $image );

		return file_exists( $path );
	}
}
