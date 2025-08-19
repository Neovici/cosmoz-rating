import { component, html, useState, css } from '@pionjs/pion';
import '../src/index';

const style = css`
	cosmoz-rating {
		--rating-star-color: #01c92d;
		--rating-star-color-empty: #48665150;
	}
`;

const InteractiveDemo = () => {
	const [rating, setRating] = useState<number | null>(null);

	const handleRatingChange = (event: CustomEvent) => {
		setRating(event.detail.rating);
	};

	return html`
		<div>
			<h1>Interactive Demo</h1>
			<cosmoz-rating
				rating="${rating || ''}"
				max-rating="${5}"
				@rating="${handleRatingChange}"
			>
			</cosmoz-rating>

			<h2>${rating ?? '0'}</h2>
		</div>
	`;
};

customElements.define(
	'interactive-demo',
	component(InteractiveDemo, { useShadowDOM: true, styleSheets: [style] }),
);
