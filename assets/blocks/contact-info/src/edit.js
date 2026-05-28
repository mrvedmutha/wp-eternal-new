const { __ } = wp.i18n;
const { InspectorControls, useBlockProps } = wp.blockEditor;
const { PanelBody, TextControl, TextareaControl } = wp.components;
const ServerSideRender = wp.serverSideRender;
const { Fragment } = wp.element;

export default function Edit( props ) {
	const { name, attributes = {}, setAttributes } = props || {};
	const {
		heading = 'Contact Us',
		body = 'Have a question, need support, or just want to chat about our products? Our team is ready to assist you. Reach out and we\'ll get back to you as soon as possible.',
		email = 'customerservice@eternallabs.health',
		emailHref = 'mailto:customerservice@eternallabs.health',
		hours = 'Mon - Fri, 9:30am - 5:30pm (GMT & EST)',
		chatLabel = 'CHAT WITH US',
		chatUrl = '#',
		appointmentLabel = 'BOOK APPOINTMENT',
		appointmentUrl = '#',
	} = attributes;

	const blockProps = useBlockProps( { className: 'contact-info-wrapper' } );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Content', 'wp-rig' ) } initialOpen={ true }>
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
				</PanelBody>
				<PanelBody title={ __( 'Contact Details', 'wp-rig' ) } initialOpen={ true }>
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
				<PanelBody title={ __( 'CTA Buttons', 'wp-rig' ) } initialOpen={ true }>
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
