const { __ } = wp.i18n;
const { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } = wp.blockEditor;
const { PanelBody, TextControl, TextareaControl, Button, Notice } = wp.components;
const ServerSideRender = wp.serverSideRender;
const { Fragment } = wp.element;

export default function Edit( props ) {
	const { name, attributes = {}, setAttributes } = props || {};
	const {
		formId = 0,
		termsUrl = '/terms-conditions/',
		privacyUrl = '/privacy-policy/',
		heading = 'Contact Us',
		body = '',
		email = 'customerservice@eternallabs.health',
		emailHref = 'mailto:customerservice@eternallabs.health',
		hours = 'Mon - Fri, 9:30am - 5:30pm (GMT & EST)',
		chatLabel = 'CHAT WITH US',
		chatUrl = '#',
		chatIconUrl = '',
		appointmentLabel = 'BOOK APPOINTMENT',
		appointmentUrl = '#',
	} = attributes;

	const blockProps = useBlockProps( { className: 'contact-section-wrapper' } );

	return (
		<Fragment>
			<InspectorControls>

				{ /* ── Contact Form ───────────────────────── */ }
				<PanelBody title={ __( 'Contact Form (CF7)', 'wp-rig' ) } initialOpen={ true }>
					{ ! formId && (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'No CF7 Form ID set. A styled placeholder form is shown.', 'wp-rig' ) }
						</Notice>
					) }
					<TextControl
						label={ __( 'CF7 Form ID', 'wp-rig' ) }
						value={ formId || '' }
						type="number"
						onChange={ ( v ) => setAttributes( { formId: parseInt( v, 10 ) || 0 } ) }
						help={ __( 'Contact → Contact Forms in WP Admin → open form → ID is in the URL.', 'wp-rig' ) }
					/>
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

				{ /* ── Info Panel Content ──────────────────── */ }
				<PanelBody title={ __( 'Info Panel', 'wp-rig' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Heading', 'wp-rig' ) }
						value={ heading }
						onChange={ ( v ) => setAttributes( { heading: v } ) }
					/>
					<TextareaControl
						label={ __( 'Body Copy', 'wp-rig' ) }
						value={ body }
						rows={ 3 }
						onChange={ ( v ) => setAttributes( { body: v } ) }
					/>
					<TextControl
						label={ __( 'Email Address', 'wp-rig' ) }
						value={ email }
						onChange={ ( v ) => setAttributes( { email: v } ) }
					/>
					<TextControl
						label={ __( 'Email Link (href)', 'wp-rig' ) }
						value={ emailHref }
						onChange={ ( v ) => setAttributes( { emailHref: v } ) }
					/>
					<TextControl
						label={ __( 'Hours', 'wp-rig' ) }
						value={ hours }
						onChange={ ( v ) => setAttributes( { hours: v } ) }
					/>
				</PanelBody>

				{ /* ── CTA Buttons ─────────────────────────── */ }
				<PanelBody title={ __( 'CTA Buttons', 'wp-rig' ) } initialOpen={ true }>

					{ /* Chat button icon upload */ }
					<div style={ { marginBottom: '16px' } }>
						<p style={ { fontSize: '11px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' } }>
							{ __( 'Chat Button Icon', 'wp-rig' ) }
						</p>
						{ chatIconUrl && (
							<img
								src={ chatIconUrl }
								alt=""
								style={ { width: '32px', height: '32px', objectFit: 'contain', display: 'block', marginBottom: '8px', background: '#021f1d', padding: '4px', borderRadius: '2px' } }
							/>
						) }
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => setAttributes( { chatIconUrl: media.url } ) }
								allowedTypes={ [ 'image' ] }
								value={ chatIconUrl }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant="secondary"
										style={ { marginBottom: chatIconUrl ? '4px' : '0' } }
									>
										{ chatIconUrl ? __( 'Change Icon', 'wp-rig' ) : __( 'Upload Icon', 'wp-rig' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						{ chatIconUrl && (
							<Button
								variant="link"
								isDestructive
								onClick={ () => setAttributes( { chatIconUrl: '' } ) }
								style={ { display: 'block', marginTop: '4px', fontSize: '11px' } }
							>
								{ __( 'Remove Icon', 'wp-rig' ) }
							</Button>
						) }
					</div>

					<TextControl
						label={ __( 'Chat Button Label', 'wp-rig' ) }
						value={ chatLabel }
						onChange={ ( v ) => setAttributes( { chatLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Chat Button URL', 'wp-rig' ) }
						value={ chatUrl }
						onChange={ ( v ) => setAttributes( { chatUrl: v } ) }
					/>
					<TextControl
						label={ __( 'Appointment Button Label', 'wp-rig' ) }
						value={ appointmentLabel }
						onChange={ ( v ) => setAttributes( { appointmentLabel: v } ) }
					/>
					<TextControl
						label={ __( 'Appointment Button URL', 'wp-rig' ) }
						value={ appointmentUrl }
						onChange={ ( v ) => setAttributes( { appointmentUrl: v } ) }
					/>
				</PanelBody>

			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</Fragment>
	);
}
