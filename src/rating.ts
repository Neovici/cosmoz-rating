import { component, html } from '@pionjs/pion';
import useRating from './hooks/use-rating';
import { styles } from './rating.css';
import { CosmozRatingElement } from '../types/cosmoz-rating.types';

function Rating(host: CosmozRatingElement) {
	const { disabled, maxRating, setHoveredRating, renderStar } = useRating(host);

	const handleMouseLeave = () => {
		if (!disabled) {
			setHoveredRating(null);
		}
	};

	return html`
		<div class="rating-container" @mouseleave="${handleMouseLeave}">
			${Array.from({ length: maxRating }, (_, index) => renderStar(index))}
		</div>
	`;
}

const CosmozRating = component(Rating, {
	observedAttributes: ['rating', 'disabled', 'max-rating'],
	useShadowDOM: true,
	styleSheets: [styles],
});

customElements.define('cosmoz-rating', CosmozRating);

export { CosmozRating };
export default CosmozRating;
