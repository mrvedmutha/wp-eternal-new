import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextareaControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

const VARIANT_OPTIONS = [
	{ label: 'Heading Only', value: 'heading-only' },
	{ label: 'Pull Quote', value: 'pull-quote' },
	{ label: 'Heading + Body', value: 'heading-body' },
	{ label: 'Heading + Body (Left)', value: 'heading-body-left' },
];

export default function Edit( { name, attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { variant, headingText, quoteText, bodyText } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Editorial Wide Text Section" initialOpen={ true }>
					<SelectControl
						label="Variant"
						value={ variant }
						options={ VARIANT_OPTIONS }
						onChange={ ( val ) => setAttributes( { variant: val } ) }
					/>

					{ ( variant === 'heading-only' || variant === 'heading-body' || variant === 'heading-body-left' ) && (
						<TextareaControl
							label="Heading"
							value={ headingText }
							onChange={ ( val ) => setAttributes( { headingText: val } ) }
							rows={ 2 }
						/>
					) }

					{ variant === 'pull-quote' && (
						<TextareaControl
							label="Quote"
							value={ quoteText }
							onChange={ ( val ) => setAttributes( { quoteText: val } ) }
							rows={ 3 }
						/>
					) }

					{ ( variant === 'heading-body' || variant === 'heading-body-left' ) && (
						<TextareaControl
							label="Body"
							value={ bodyText }
							onChange={ ( val ) => setAttributes( { bodyText: val } ) }
							rows={ 4 }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ServerSideRender block={ name } attributes={ attributes } />
			</div>
		</>
	);
}
