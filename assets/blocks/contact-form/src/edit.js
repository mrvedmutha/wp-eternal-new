const { __ } = wp.i18n;
const { InspectorControls, useBlockProps } = wp.blockEditor;
const { PanelBody, TextControl, Notice } = wp.components;
const ServerSideRender = wp.serverSideRender;
const { Fragment } = wp.element;

export default function Edit( props ) {
	const { name, attributes = {}, setAttributes } = props || {};
	const {
		formId = 0,
		termsUrl = '/terms-conditions/',
		privacyUrl = '/privacy-policy/',
	} = attributes;

	const blockProps = useBlockProps( { className: 'contact-form-wrapper' } );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Contact Form 7', 'wp-rig' ) } initialOpen={ true }>
					{ ! formId && (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'No form ID set. A styled placeholder form is shown. Add a CF7 Form ID to wire up submissions.', 'wp-rig' ) }
						</Notice>
					) }
					<TextControl
						label={ __( 'CF7 Form ID', 'wp-rig' ) }
						value={ formId || '' }
						type="number"
						onChange={ ( v ) => setAttributes( { formId: parseInt( v, 10 ) || 0 } ) }
						help={ __( 'Go to Contact → Contact Forms in WP Admin, open the form, and copy the ID from the URL or title bar.', 'wp-rig' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Legal Links', 'wp-rig' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Terms & Conditions URL', 'wp-rig' ) }
						value={ termsUrl }
						onChange={ ( v ) => setAttributes( { termsUrl: v } ) }
					/>
					<TextControl
						label={ __( 'Privacy Policy URL', 'wp-rig' ) }
						value={ privacyUrl }
						onChange={ ( v ) => setAttributes( { privacyUrl: v } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</Fragment>
	);
}
