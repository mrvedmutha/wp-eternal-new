/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Edit function for the Login Form block.
 *
 * @return {JSX.Element} The block edit component.
 */
export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'login-form-wrapper',
	} );

	return (
		<div { ...blockProps }>
			<div className="login-form">
				<div className="login-form__title">
					<p className="login-form__title-main">MY ETERNAL ACCOUNT</p>
				</div>
				<div className="login-form__form">
					<p className="login-form__preview-text">
						{ __( 'Login Form – Preview mode', 'wp-rig' ) }
					</p>
					<p className="login-form__preview-text">
						{ __( 'This form will be rendered on the frontend.', 'wp-rig' ) }
					</p>
				</div>
			</div>
		</div>
	);
}
