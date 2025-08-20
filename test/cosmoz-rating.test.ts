import { expect, fixture, html, nextFrame } from '@open-wc/testing';
import { spy } from 'sinon';
import '../src/index.js';

describe('cosmoz-rating', () => {
	it('should render with default state (unrated)', async () => {
		const el = await fixture(html`<cosmoz-rating></cosmoz-rating>`);
		expect(el).to.be.instanceOf(HTMLElement);
		expect(el.tagName.toLowerCase()).to.equal('cosmoz-rating');

		const stars = el.shadowRoot?.querySelectorAll('.star');
		expect(stars).to.have.length(5);

		// All stars should be empty (gray)
		stars?.forEach((star) => {
			expect(star.classList.contains('filled')).to.be.false;
			expect(star.classList.contains('partial')).to.be.false;
		});
	});

	it('should render with a numeric rating', async () => {
		const el = await fixture(html`<cosmoz-rating rating="3"></cosmoz-rating>`);
		const stars = el.shadowRoot?.querySelectorAll('.star');

		const filledFlags = Array.from(stars ?? []).map((s) =>
			s.classList.contains('filled'),
		);

		// // First 3 stars should be filled
		expect(filledFlags.slice(0, 3)).to.deep.equal([true, true, true]);
		// // Last 2 stars should be empty
		expect(filledFlags.slice(3, 5)).to.deep.equal([false, false]);
	});

	it('should render fractional ratings correctly', async () => {
		const el = await fixture(
			html`<cosmoz-rating rating="2.5"></cosmoz-rating>`,
		);
		const stars = el.shadowRoot?.querySelectorAll('.star');

		// First 2 stars should be filled
		expect(stars?.[0].classList.contains('filled')).to.be.true;
		expect(stars?.[1].classList.contains('filled')).to.be.true;

		// Third star should be partial
		expect(stars?.[2].classList.contains('partial')).to.be.true;

		// Last 2 stars should be empty
		expect(stars?.[3].classList.contains('filled')).to.be.false;
		expect(stars?.[4].classList.contains('filled')).to.be.false;
	});

	it('should respect custom max-rating', async () => {
		const el = await fixture(
			html`<cosmoz-rating max-rating="10"></cosmoz-rating>`,
		);
		const stars = el.shadowRoot?.querySelectorAll('.star');

		expect(stars).to.have.length(10);
	});

	it('should be disabled when disabled attribute is present', async () => {
		const el = await fixture(
			html`<cosmoz-rating rating="3" disabled></cosmoz-rating>`,
		);

		expect(el.hasAttribute('disabled')).to.be.true;

		// Should have disabled styles applied
		const computedStyle = getComputedStyle(el);
		expect(computedStyle.pointerEvents).to.equal('none');
	});

	it('should emit change event when star is clicked', async () => {
		const el = await fixture(html`<cosmoz-rating></cosmoz-rating>`);
		const eventSpy = spy();

		el.addEventListener('change', eventSpy);

		const thirdStar = el.shadowRoot?.querySelectorAll('.star')[2];
		expect(thirdStar).to.exist;

		// Simulate user click by dispatching the event on the star element
		thirdStar!.dispatchEvent(
			new MouseEvent('click', { bubbles: true, composed: true }),
		);

		// allow event loop to process
		await nextFrame();

		expect(eventSpy.calledOnce).to.be.true;
		expect(eventSpy.firstCall.args[0].detail.rating).to.equal(3);
	});

	it('should not emit rating event when disabled', async () => {
		const el = await fixture(html`<cosmoz-rating disabled></cosmoz-rating>`);
		const eventSpy = spy();

		el.addEventListener('rating', eventSpy);

		const firstStar = el.shadowRoot?.querySelectorAll('.star')[0];
		firstStar?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

		expect(eventSpy.called).to.be.false;
	});

	it('should handle attribute changes', async () => {
		const el = await fixture(html`<cosmoz-rating></cosmoz-rating>`);

		// Change rating
		el.setAttribute('rating', '4');

		await nextFrame(); // Wait for re-render

		const stars = el.shadowRoot?.querySelectorAll('.star');

		// First 4 stars should be filled
		for (let i = 0; i < 4; i++) {
			expect(stars?.[i].classList.contains('filled')).to.be.true;
		}

		// Last star should be empty
		expect(stars?.[4].classList.contains('filled')).to.be.false;
	});

	it('should handle edge cases', async () => {
		// Rating of 0
		const el1 = await fixture(html`<cosmoz-rating rating="0"></cosmoz-rating>`);
		const stars1 = el1.shadowRoot?.querySelectorAll('.star');
		stars1?.forEach((star) => {
			expect(star.classList.contains('filled')).to.be.false;
		});

		// Rating higher than max
		const el2 = await fixture(
			html`<cosmoz-rating rating="6" max-rating="5"></cosmoz-rating>`,
		);
		const stars2 = el2.shadowRoot?.querySelectorAll('.star');
		// All 5 stars should be filled
		stars2?.forEach((star) => {
			expect(star.classList.contains('filled')).to.be.true;
		});

		// Negative rating
		const el3 = await fixture(
			html`<cosmoz-rating rating="-1"></cosmoz-rating>`,
		);
		const stars3 = el3.shadowRoot?.querySelectorAll('.star');
		stars3?.forEach((star) => {
			expect(star.classList.contains('filled')).to.be.false;
		});
	});

	it('should have accessible structure', async () => {
		const el = (await fixture(
			html`<cosmoz-rating rating="3"></cosmoz-rating>`,
		)) as HTMLElement;

		// Component should be focusable when not disabled
		expect(el.tabIndex).to.not.equal(-1);

		// When disabled, should not be focusable
		el.setAttribute('disabled', '');
		await nextFrame(); // Wait for re-render

		expect(el.tabIndex).to.equal(-1);
	});
});
