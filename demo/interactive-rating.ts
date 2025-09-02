import { component, html, useState } from '@pionjs/pion';
import '../src/index';

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
				@change="${handleRatingChange}"
			>
			</cosmoz-rating>

			<h2>${rating ?? '0'}</h2>
		</div>
	`;
};

customElements.define(
	'interactive-demo',
	component(InteractiveDemo, { useShadowDOM: true }),
);
