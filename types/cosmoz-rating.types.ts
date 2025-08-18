export interface RatingEvent extends CustomEvent {
	detail: {
		rating: number;
	};
}

export interface CosmozRatingProps {
	rating?: number | null;
	disabled?: boolean;
	maxRating?: number;
}

export interface CosmozRatingElement extends HTMLElement, CosmozRatingProps {}

export {};
