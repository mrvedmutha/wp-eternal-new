import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { heading, body, caption, marqueeText, mediaId, mediaUrl } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Image" initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									mediaId: media.id,
									mediaUrl: media.url,
									mediaAlt: media.alt || '',
								} )
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
											onClick={ () =>
												setAttributes( { mediaId: 0, mediaUrl: '', mediaAlt: '' } )
											}
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
						placeholder="Synthesis Explosion"
					/>
					<TextareaControl
						label="Body"
						value={ body }
						onChange={ ( val ) => setAttributes( { body: val } ) }
						rows={ 5 }
					/>
					<TextareaControl
						label="Caption (small text)"
						value={ caption }
						onChange={ ( val ) => setAttributes( { caption: val } ) }
						rows={ 3 }
					/>
				</PanelBody>

				<PanelBody title="Marquee" initialOpen={ true }>
					<TextareaControl
						label="Marquee Items (comma-separated)"
						value={ marqueeText }
						onChange={ ( val ) => setAttributes( { marqueeText: val } ) }
						rows={ 3 }
						help="Enter items separated by commas. e.g. IMMUNITY, REGENERATION, DETOX"
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
