import { css } from '@pionjs/pion';

export const styles = css`
	:host {
		display: inline-block;
		--cosmoz-rating-color: #cf2005;
		--cosmoz-rating-color-fill: var(--cosmoz-rating-color);
		--cosmoz-rating-color-empty: transparent;
		--cosmoz-rating-color-hover: var(--cosmoz-rating-color);
		--cosmoz-rating-color-border: var(--cosmoz-rating-color);
		--cosmoz-rating-color-border-empty: var(--cosmoz-rating-color);
		--cosmoz-rating-color-border-hover: var(--cosmoz-rating-color);

		/* Size and spacing */
		--rating-star-size: 24px;
		--rating-star-gap: 2px;
		--rating-star-border-width: 1px;
	}

	:host([disabled]) {
		pointer-events: none;
	}

	.rating-container {
		display: flex;
		gap: var(--rating-star-gap);
		align-items: center;
	}

	.star {
		width: var(--rating-star-size);
		height: var(--rating-star-size);
		cursor: pointer;
		transition:
			fill 0.2s ease,
			stroke 0.2s ease,
			stroke-width 0.2s ease;
	}

	:host([disabled]) .star {
		cursor: default;
	}

	.star path {
		stroke: var(--cosmoz-rating-color-border-empty);
		stroke-width: var(--rating-star-border-width);
		fill: var(--cosmoz-rating-color-empty);
		transition:
			fill 0.2s ease,
			stroke 0.2s ease;
	}

	.star.filled path {
		fill: var(--cosmoz-rating-color-fill);
		stroke: var(--cosmoz-rating-color-border);
	}

	.star.partial > path:first-of-type {
		fill: var(--cosmoz-rating-color-empty);
		stroke: var(--cosmoz-rating-color-border);
	}

	.star.partial > path:last-of-type {
		fill: var(--cosmoz-rating-color-fill);
		stroke: var(--cosmoz-rating-color-border);
	}

	.star:hover path {
		fill: var(--cosmoz-rating-color-hover) !important;
		stroke: var(--cosmoz-rating-color-border-hover) !important;
	}
`;
