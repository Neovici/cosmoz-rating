import { useState, html, useEffect } from '@pionjs/pion';
import { svg } from 'lit-html';
import { useHost } from '@neovici/cosmoz-utils/hooks/use-host';
import { Props } from '../types';

const useRating = (props: Props) => {
	const host = useHost();

	const [hoveredRating, setHoveredRating] = useState<number | null>(null);

	const ratingRaw = props.rating;
	const rating = ratingRaw ? parseFloat(ratingRaw) : null;
	const disabled = props.disabled;
	const maxRatingRaw = props.maxRating;
	const maxRating = maxRatingRaw ? parseInt(maxRatingRaw, 10) : 5;

	useEffect(() => {
		// Set appropriate tabIndex for accessibility
		if (!disabled && host.tabIndex === -1) {
			host.tabIndex = 0;
		} else if (disabled) {
			host.tabIndex = -1;
		}
	}, [disabled]);

	const getStarClass = (starIndex: number): string => {
		const currentRating = hoveredRating ?? rating;

		if (currentRating === null || currentRating === undefined) {
			return 'star';
		}

		if (starIndex <= Math.floor(currentRating)) {
			return 'star filled';
		} else if (
			starIndex === Math.ceil(currentRating) &&
			currentRating % 1 !== 0
		) {
			return 'star partial';
		}

		return 'star';
	};

	const handleStarClick = (starRating: number) => {
		if (disabled) return;

		host.dispatchEvent(
			new CustomEvent('change', {
				detail: { rating: starRating },
				bubbles: true,
				composed: true,
			}),
		);
	};

	const handleStarHover = (starRating: number) => {
		if (disabled) return;

		setHoveredRating(starRating);
	};

	const handleComponentLeave = () => {
		if (disabled) return;

		setHoveredRating(null);
	};

	const renderStar = (index: number) => {
		const starRating = index + 1;
		const starClass = getStarClass(starRating);
		const isPartial = starClass.includes('partial');

		let fillPercentage = 0;
		if (isPartial && rating !== null) {
			fillPercentage = Math.round((rating % 1) * 100);
		}

		const starPath =
			'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

		const partialPaths = svg`<defs>
						<clipPath id="clip-${index}">
							<rect x="0" y="0" width="${fillPercentage}%" height="100%" />
						</clipPath>
					</defs>
					<!-- Background (empty) star -->
					<path d="${starPath}" fill="var(--rating-star-color-empty)"></path>
					<!-- Partial fill (clipped) star -->
					<path
						d="${starPath}"
						fill="var(--rating-star-color)"
						clip-path="url(#clip-${index})"
					></path>`;

		return html`
			<svg
				class="${starClass}"
				@click="${() => handleStarClick(starRating)}"
				@mouseenter="${() => handleStarHover(starRating)}"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				${isPartial
					? partialPaths
					: svg`<path
					d="${starPath}"
					fill="${
						starClass.includes('filled')
							? 'var(--rating-star-color)'
							: 'var(--rating-star-color-empty)'
					}"
				></path>`}
			</svg>
		`;
	};

	return { rating, disabled, maxRating, handleComponentLeave, renderStar };
};

export default useRating;
