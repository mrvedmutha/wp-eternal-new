import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

const DEFAULT_SLIDE = {
	heading:        'The Pinnacle of Longevity Supplements',
	subtext:        'Advanced nutraceutical formulations developed to support wellbeing from within.',
	ctaLabel:       'SHOP NOW',
	ctaUrl:         '/shop',
	desktopImageId:  0,
	desktopImageUrl: '',
	mobileImageId:   0,
	mobileImageUrl:  '',
};

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { slides, slideInterval } = attributes;

	const updateSlide = ( index, key, value ) => {
		const next = slides.map( ( s, i ) => i === index ? { ...s, [ key ]: value } : s );
		setAttributes( { slides: next } );
	};

	const addSlide = () => {
		setAttributes( { slides: [ ...slides, { ...DEFAULT_SLIDE } ] } );
	};

	const removeSlide = ( index ) => {
		setAttributes( { slides: slides.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<>
			<InspectorControls>

				<PanelBody title="Slideshow Settings" initialOpen={ true }>
					<RangeControl
						label="Slide interval (ms)"
						value={ slideInterval }
						onChange={ ( val ) => setAttributes( { slideInterval: val } ) }
						min={ 2000 }
						max={ 10000 }
						step={ 500 }
					/>
				</PanelBody>

				{ slides.map( ( slide, index ) => (
					<PanelBody
						key={ index }
						title={ `Slide ${ index + 1 }${ slide.heading ? ` — ${ slide.heading.slice( 0, 30 ) }…` : '' }` }
						initialOpen={ index === 0 }
					>
						{ /* Desktop image */ }
						<p style={ { marginBottom: 4, fontWeight: 600 } }>Desktop Image</p>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									updateSlide( index, 'desktopImageId', media.id );
									updateSlide( index, 'desktopImageUrl', media.url );
								} }
								allowedTypes={ [ 'image' ] }
								value={ slide.desktopImageId }
								render={ ( { open } ) => (
									<div style={ { marginBottom: 12 } }>
										{ slide.desktopImageUrl && (
											<img src={ slide.desktopImageUrl } alt="" style={ { width: '100%', marginBottom: 6 } } />
										) }
										<Button variant="secondary" onClick={ open }>
											{ slide.desktopImageId ? 'Replace Desktop Image' : 'Select Desktop Image' }
										</Button>
										{ slide.desktopImageId && (
											<Button
												variant="link"
												isDestructive
												onClick={ () => {
													updateSlide( index, 'desktopImageId', 0 );
													updateSlide( index, 'desktopImageUrl', '' );
												} }
												style={ { marginLeft: 8 } }
											>
												Remove
											</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>

						{ /* Mobile image */ }
						<p style={ { marginBottom: 4, fontWeight: 600 } }>Mobile Image (Portrait)</p>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									updateSlide( index, 'mobileImageId', media.id );
									updateSlide( index, 'mobileImageUrl', media.url );
								} }
								allowedTypes={ [ 'image' ] }
								value={ slide.mobileImageId }
								render={ ( { open } ) => (
									<div style={ { marginBottom: 12 } }>
										{ slide.mobileImageUrl && (
											<img src={ slide.mobileImageUrl } alt="" style={ { width: '100%', marginBottom: 6 } } />
										) }
										<Button variant="secondary" onClick={ open }>
											{ slide.mobileImageId ? 'Replace Mobile Image' : 'Select Mobile Image' }
										</Button>
										{ slide.mobileImageId && (
											<Button
												variant="link"
												isDestructive
												onClick={ () => {
													updateSlide( index, 'mobileImageId', 0 );
													updateSlide( index, 'mobileImageUrl', '' );
												} }
												style={ { marginLeft: 8 } }
											>
												Remove
											</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>

						{ /* Content */ }
						<TextControl
							label="Heading"
							value={ slide.heading }
							onChange={ ( val ) => updateSlide( index, 'heading', val ) }
						/>
						<TextareaControl
							label="Subtext"
							value={ slide.subtext }
							onChange={ ( val ) => updateSlide( index, 'subtext', val ) }
						/>
						<TextControl
							label="CTA Label"
							value={ slide.ctaLabel }
							onChange={ ( val ) => updateSlide( index, 'ctaLabel', val ) }
						/>
						<TextControl
							label="CTA URL"
							value={ slide.ctaUrl }
							onChange={ ( val ) => updateSlide( index, 'ctaUrl', val ) }
						/>

						{ slides.length > 1 && (
							<Button
								variant="link"
								isDestructive
								onClick={ () => removeSlide( index ) }
								style={ { marginTop: 8 } }
							>
								Remove Slide { index + 1 }
							</Button>
						) }
					</PanelBody>
				) ) }

				<div style={ { padding: '12px 16px' } }>
					<Button variant="primary" onClick={ addSlide } style={ { width: '100%' } }>
						+ Add Slide
					</Button>
				</div>

			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
