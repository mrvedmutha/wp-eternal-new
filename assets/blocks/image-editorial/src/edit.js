import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextareaControl, Button } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { imageId, imageUrl, headlineText, bodyParagraph1, bodyParagraph2, bodyParagraph3 } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Background Image" initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									imageId: media.id,
									imageUrl: media.url,
									imageAlt: media.alt || '',
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<div style={ { marginBottom: '16px' } }>
									{ imageUrl && (
										<img
											src={ imageUrl }
											alt=""
											style={ { width: '100%', marginBottom: '8px' } }
										/>
									) }
									<Button variant="secondary" onClick={ open }>
										{ imageId ? 'Replace Image' : 'Select Image' }
									</Button>
									{ imageId && (
										<Button
											variant="link"
											isDestructive
											onClick={ () =>
												setAttributes( {
													imageId: 0,
													imageUrl: '',
													imageAlt: '',
												} )
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
					<TextareaControl
						label="Headline"
						value={ headlineText }
						onChange={ ( val ) => setAttributes( { headlineText: val } ) }
						rows={ 2 }
					/>
					<TextareaControl
						label="Body — Paragraph 1"
						value={ bodyParagraph1 }
						onChange={ ( val ) => setAttributes( { bodyParagraph1: val } ) }
						rows={ 3 }
					/>
					<TextareaControl
						label="Body — Paragraph 2"
						value={ bodyParagraph2 }
						onChange={ ( val ) => setAttributes( { bodyParagraph2: val } ) }
						rows={ 3 }
					/>
					<TextareaControl
						label="Body — Paragraph 3"
						value={ bodyParagraph3 }
						onChange={ ( val ) => setAttributes( { bodyParagraph3: val } ) }
						rows={ 3 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
