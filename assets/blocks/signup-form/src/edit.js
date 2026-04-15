import ServerSideRender from '@wordpress/server-side-render';
// WP globals
const { useBlockProps } = wp.blockEditor;
const { InspectorControls, PanelBody, TextControl, TextareaControl } = wp.components;
const { __ } = wp.i18n;
const { Fragment } = wp.element;

export default function Edit(props) {
	const { name, attributes = {}, setAttributes } = props || {};
	const blockProps = useBlockProps();

	const {
		termsUrl = '/terms/',
		privacyUrl = '/privacy-policy/',
		marketingTitle = 'Sign me up to hear more from Eternal Labs.',
		marketingDescription = 'By checking this box, you agree to receive marketing emails and other communications from Eternal Labs. To learn more, view our PRIVACY POLICY.',
		termsAgreementText = 'By clicking Create Account button I agree to ETERNAL-LABS TERMS & CONDITIONS and PRIVACY POLICY.',
	} = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Legal Page Links', 'wp-rig')} initialOpen={true}>
					<TextControl
						label={__('Terms Page URL', 'wp-rig')}
						value={termsUrl}
						onChange={(value) => setAttributes({ termsUrl: value })}
						help={__('The relative URL to your Terms & Conditions page', 'wp-rig')}
					/>
					<TextControl
						label={__('Privacy Policy URL', 'wp-rig')}
						value={privacyUrl}
						onChange={(value) => setAttributes({ privacyUrl: value })}
						help={__('The relative URL to your Privacy Policy page', 'wp-rig')}
					/>
				</PanelBody>

				<PanelBody title={__('Marketing Consent', 'wp-rig')} initialOpen={true}>
					<TextControl
						label={__('Consent Title', 'wp-rig')}
						value={marketingTitle}
						onChange={(value) => setAttributes({ marketingTitle: value })}
					/>
					<TextareaControl
						label={__('Consent Description', 'wp-rig')}
						value={marketingDescription}
						onChange={(value) => setAttributes({ marketingDescription: value })}
						rows={3}
					/>
				</PanelBody>

				<PanelBody title={__('Terms Agreement Text', 'wp-rig')} initialOpen={true}>
					<TextareaControl
						label={__('Agreement Text', 'wp-rig')}
						value={termsAgreementText}
						onChange={(value) => setAttributes({ termsAgreementText: value })}
						rows={2}
						help={__('Text displayed below the form, above the submit button', 'wp-rig')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ServerSideRender block={name} attributes={attributes} />
			</div>
		</Fragment>
	);
}
