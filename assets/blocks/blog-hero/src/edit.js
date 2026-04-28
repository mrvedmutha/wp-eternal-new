import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { heading, subtitle, ctaText, ctaUrl, bgImageId, bgImageUrl } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Background Image" initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									bgImageId:  media.id,
									bgImageUrl: media.url,
									bgImageAlt: media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ bgImageId }
							render={ ( { open } ) => (
								<div>
									{ bgImageUrl && (
										<img src={ bgImageUrl } alt="" style={ { width: '100%', marginBottom: '8px' } } />
									) }
									<Button variant="secondary" onClick={ open }>
										{ bgImageId ? 'Replace Image' : 'Select Image' }
									</Button>
									{ bgImageId && (
										<Button
											variant="link"
											isDestructive
											onClick={ () => setAttributes( { bgImageId: 0, bgImageUrl: '', bgImageAlt: '' } ) }
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
					/>
					<TextareaControl
						label="Subtitle"
						value={ subtitle }
						onChange={ ( val ) => setAttributes( { subtitle: val } ) }
					/>
				</PanelBody>

				<PanelBody title="CTA" initialOpen={ true }>
					<TextControl
						label="Label"
						value={ ctaText }
						onChange={ ( val ) => setAttributes( { ctaText: val } ) }
					/>
					<TextControl
						label="URL"
						value={ ctaUrl }
						onChange={ ( val ) => setAttributes( { ctaUrl: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
