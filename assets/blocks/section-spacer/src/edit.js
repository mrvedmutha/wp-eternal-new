const { useBlockProps, InspectorControls } = wp.blockEditor;
const { PanelBody, __experimentalNumberControl: NumberControl } = wp.components;

export default function Edit( { attributes, setAttributes } ) {
	const { spacingDesktop, spacingTablet, spacingMobile } = attributes;
	const blockProps = useBlockProps( {
		style: { height: spacingDesktop + 'px' },
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Spacing" initialOpen={ true }>
					<NumberControl
						label="Desktop (px)"
						value={ spacingDesktop }
						min={ 0 }
						max={ 400 }
						onChange={ ( val ) =>
							setAttributes( { spacingDesktop: parseInt( val, 10 ) || 0 } )
						}
					/>
					<NumberControl
						label="Tablet — ≤1024px (px)"
						value={ spacingTablet }
						min={ 0 }
						max={ 400 }
						onChange={ ( val ) =>
							setAttributes( { spacingTablet: parseInt( val, 10 ) || 0 } )
						}
					/>
					<NumberControl
						label="Mobile — ≤768px (px)"
						value={ spacingMobile }
						min={ 0 }
						max={ 400 }
						onChange={ ( val ) =>
							setAttributes( { spacingMobile: parseInt( val, 10 ) || 0 } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<span className="section-spacer__label">
					Spacer: { spacingDesktop }px / { spacingTablet }px / { spacingMobile }px
				</span>
			</div>
		</>
	);
}
