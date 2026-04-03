import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { hashtag, heading, body, ctaLabel, ctaUrl, mediaId, mediaUrl } = attributes;

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
						label="Hashtag"
						value={ hashtag }
						onChange={ ( val ) => setAttributes( { hashtag: val } ) }
						placeholder="#EternalWellbeing"
					/>
					<TextControl
						label="Heading"
						value={ heading }
						onChange={ ( val ) => setAttributes( { heading: val } ) }
					/>
					<TextareaControl
						label="Body"
						value={ body }
						onChange={ ( val ) => setAttributes( { body: val } ) }
						rows={ 5 }
						help="Use **text** for bold."
					/>
				</PanelBody>

				<PanelBody title="CTA" initialOpen={ false }>
					<TextControl
						label="Label"
						value={ ctaLabel }
						onChange={ ( val ) => setAttributes( { ctaLabel: val } ) }
						placeholder="DISCOVER THE STORY"
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
