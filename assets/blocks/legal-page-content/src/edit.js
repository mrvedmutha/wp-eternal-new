import { useBlockProps, InspectorControls, RichText, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [
	'core/heading',
	'core/paragraph',
	'core/list',
	'wp-rig/styled-list',
	'core/buttons',
];

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { heroLabel, heroHeading, heroLastUpdated } = attributes;

	const blockProps = useBlockProps( {
		className: 'legal-page-content-editor',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Hero Section', 'wp-rig' ) }>
					<div style={ { marginBottom: '16px' } }>
						<label
							htmlFor="hero-label"
							style={ { display: 'block', marginBottom: '8px', fontWeight: 'bold' } }
						>
							{ __( 'Label (e.g., LEGAL)', 'wp-rig' ) }
						</label>
						<RichText
							id="hero-label"
							value={ heroLabel }
							onChange={ ( value ) => setAttributes( { heroLabel: value } ) }
							placeholder={ __( 'LEGAL', 'wp-rig' ) }
							allowedFormats={ [] }
							style={ { width: '100%' } }
						/>
					</div>

					<div style={ { marginBottom: '16px' } }>
						<label
							htmlFor="hero-heading"
							style={ { display: 'block', marginBottom: '8px', fontWeight: 'bold' } }
						>
							{ __( 'Heading', 'wp-rig' ) }
						</label>
						<RichText
							id="hero-heading"
							value={ heroHeading }
							onChange={ ( value ) => setAttributes( { heroHeading: value } ) }
							placeholder={ __( 'Page Title', 'wp-rig' ) }
							allowedFormats={ [] }
							style={ { width: '100%', fontSize: '20px' } }
						/>
					</div>

					<div>
						<label
							htmlFor="hero-last-updated"
							style={ { display: 'block', marginBottom: '8px', fontWeight: 'bold' } }
						>
							{ __( 'Last Updated Text', 'wp-rig' ) }
						</label>
						<textarea
							id="hero-last-updated"
							value={ heroLastUpdated }
							onChange={ ( e ) => setAttributes( { heroLastUpdated: e.target.value } ) }
							placeholder={ __( 'Last updated: March 2026', 'wp-rig' ) }
							style={ { width: '100%', minHeight: '60px' } }
						/>
					</div>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<section className="legal-page-content__hero" style={ { textAlign: 'center', padding: '80px 0' } }>
					<p
						className="legal-page-content__hero-label"
						style={ {
							fontSize: '15px',
							color: '#868686',
							margin: '0 0 16px 0',
						} }
					>
						<RichText
							value={ heroLabel }
							onChange={ ( value ) => setAttributes( { heroLabel: value } ) }
							allowedFormats={ [] }
							placeholder={ __( 'LEGAL', 'wp-rig' ) }
						/>
					</p>
					<h1
						className="legal-page-content__hero-heading"
						style={ {
							fontSize: '52px',
							fontFamily: 'Cormorant Garamond, serif',
							fontWeight: '300',
							lineHeight: '1.1',
							margin: '0 0 16px 0',
						} }
					>
						<RichText
							value={ heroHeading }
							onChange={ ( value ) => setAttributes( { heroHeading: value } ) }
							allowedFormats={ [] }
							placeholder={ __( 'Page Title', 'wp-rig' ) }
						/>
					</h1>
					{ heroLastUpdated && (
						<p
							className="legal-page-content__hero-date"
							style={ {
								fontSize: '15px',
								color: '#868686',
								margin: '0',
							} }
						>
							{ heroLastUpdated }
						</p>
					) }
				</section>

				<section
					className="legal-page-content__content"
					style={ { backgroundColor: '#fff' } }
				>
					<div
						className="legal-page-content__content-inner"
						style={ {
							maxWidth: '760px',
							margin: '0 auto',
							padding: '80px 20px',
							textAlign: 'left',
						} }
					>
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ [
								[ 'core/heading', {
									level: 2,
									content: 'Section Heading',
									placeholder: 'Add H2 heading...',
								} ],
								[ 'core/heading', {
									level: 3,
									content: 'Subsection Heading',
									placeholder: 'Add H3 heading...',
								} ],
								[ 'core/paragraph', { content: 'Add your content here...' } ],
							] }
							templateLock={ false }
						/>
					</div>
				</section>
			</div>
		</>
	);
}
