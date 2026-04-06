import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { heading, body, mediaId, mediaUrl, bottomText, ctaLabel, ctaUrl } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Image" initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( { mediaId: media.id, mediaUrl: media.url } )
							}
							allowedTypes={ [ 'image' ] }
							value={ mediaId }
							render={ ( { open } ) => (
								<div>
									{ mediaUrl && (
										<img
											src={ mediaUrl }
											alt=""
											style={ { width: '100%', marginBottom: '8px' } }
										/>
									) }
									<Button variant="secondary" onClick={ open }>
										{ mediaId ? 'Replace Image' : 'Select Image' }
									</Button>
									{ mediaId && (
										<Button
											variant="link"
											isDestructive
											onClick={ () => setAttributes( { mediaId: 0, mediaUrl: '' } ) }
											style={ { marginLeft: '8px' } }
										>
											Remove
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody title="Content" initialOpen={ true }>
					<TextControl
						label="Heading"
						value={ heading }
						onChange={ ( val ) => setAttributes( { heading: val } ) }
						placeholder="Virtual Wellness Appointment"
					/>
					<TextareaControl
						label="Body"
						value={ body }
						onChange={ ( val ) => setAttributes( { body: val } ) }
						rows={ 5 }
						help="Use a blank line between paragraphs."
					/>
				</PanelBody>

				<PanelBody title="Bottom Section" initialOpen={ false }>
					<TextareaControl
						label="Text"
						value={ bottomText }
						onChange={ ( val ) => setAttributes( { bottomText: val } ) }
						rows={ 3 }
						help="Shown alone as a tagline, or above the CTA label if one is set."
					/>
					<TextControl
						label="CTA Label"
						value={ ctaLabel }
						onChange={ ( val ) => setAttributes( { ctaLabel: val } ) }
						placeholder="BOOK YOUR APPOINTMENT"
						help="If set, the CTA variant is shown. Leave empty for tagline-only."
					/>
					<TextControl
						label="CTA URL"
						value={ ctaUrl }
						onChange={ ( val ) => setAttributes( { ctaUrl: val } ) }
						placeholder="https://"
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
