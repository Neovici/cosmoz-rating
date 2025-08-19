import { component, html, useEffect } from '@pionjs/pion';
import useRating from './hooks/use-rating';
import { styles } from './rating.css';
import { CosmozRatingElement } from '../types/cosmoz-rating.types';

function Rating(host: CosmozRatingElement) {
	const { disabled, maxRating, setHoveredRating, renderStar } = useRating(host);

	useEffect(() => {
		// Set appropriate tabIndex for accessibility
		if (!disabled && host.tabIndex === -1) {
			host.tabIndex = 0;
		} else if (disabled) {
			host.tabIndex = -1;
		}
	}, [disabled]);

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
