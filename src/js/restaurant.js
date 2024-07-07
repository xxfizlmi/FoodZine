const html = String.raw;

document.addEventListener('DOMContentLoaded', async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const terserah = urlParams.get('terserah') === 'true';
	const surprise = urlParams.get('surprise') === 'true';

	const id =
		terserah || surprise
			? Math.floor(Math.random() * 7) + 1
			: urlParams.get('id');

	const image = document.querySelector('#imageContainer');
	const name = document.querySelector('#name');
	const rating = document.querySelector('#rating');
	const address = document.querySelector('#address');
	const phone = document.querySelector('#phone');
	const open = document.querySelector('#open');
	const type = document.querySelector('#type');
	const capacity = document.querySelector('#capacity');
	const branch = document.querySelector('#branch');

	const facilities = document.querySelector('#facilities');
	const reviews = document.querySelector('#reviews');

	const lihat = document.querySelector('#lihat');
	const ulas = document.querySelector('#ulas');

	if (terserah)
		document.querySelector('#terserah').classList.remove('hidden');
	if (surprise)
		document.querySelector('#surprise').classList.remove('hidden');

	Promise.all([
		fetch(`http://localhost:3000/restaurants/${id}`),
		fetch(`http://localhost:3000/reviews`),
	])
		.then((responses) =>
			Promise.all(responses.map((response) => response.json()))
		)
		.then(async (data) => {
			const delay = 500;
			await new Promise((resolve) => setTimeout(resolve, delay));

			const [detail, reviewData] = data;

			lihat.href = `menu.html?id=${id}`;
			ulas.href = `review.html?id=${id}`;

			image.innerHTML = html` <img alt="restaurant" class="object-cover w-full h-full" src="${detail.image}" /> `;
			name.textContent = detail.name;
			rating.textContent = detail.rating;

			address.textContent = detail.address;
			phone.textContent = detail.phone;
			open.textContent = detail.open;

			type.textContent = detail.type;
			capacity.textContent = detail.capacity;
			branch.textContent = detail.branch ? 'Ya' : 'Tidak';

			Object.entries(detail.scores).forEach(([key, value]) => {
				document.querySelector(`#${key}`).textContent = value;
			});

			renderFacility(facilities, detail.facilities);
			renderReview(reviews, reviewData);
		})
		.catch((error) => {
			alert(`Error: ${error}`);
			window.history.back();
		});

	const copy = document.querySelector('#copy');
	const modal = document.querySelector('#modal');
	copy.addEventListener('click', () => {
		modal.classList.remove('hidden');
		navigator.clipboard.writeText(window.location.href);
		setTimeout(() => {
			modal.classList.add('hidden');
		}, 1000);
	});
});

const renderFacility = (container, data) => {
	container.innerHTML = '';

	data.forEach((facility) => {
		const node = document.createElement('div');
		node.classList.add('flex', 'items-center', 'text-sm', 'space-x-2');
		node.innerHTML = html`
			<span class="material-symbols-outlined text-green-600"> check </span>
			<span>${facility}</span>
		`;
		container.appendChild(node);
	});
};

const relativeTime = (timestamp) => {
	const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
	const time = new Date(timestamp);
	const now = new Date();
	const diff = time.getTime() - now.getTime();

	if (diff < 0) return rtf.format(-1, 'day');
	if (diff < 60 * 1000) return rtf.format(-1, 'second');
	if (diff < 60 * 60 * 1000) return rtf.format(-1, 'minute');
	if (diff < 24 * 60 * 60 * 1000) return rtf.format(-1, 'hour');
	if (diff < 30 * 24 * 60 * 60 * 1000) return rtf.format(-1, 'day');
	if (diff < 12 * 30 * 24 * 60 * 60 * 1000) return rtf.format(-1, 'month');
	return rtf.format(-1, 'year');
};

const renderReview = (container, data) => {
	container.innerHTML = '';

	data.forEach((review) => {
		const node = document.createElement('div');
		node.classList.add(
			'grid',
			'grid-cols-1',
			'gap-6',
			'mt-6',
			'xl:grid-cols-6'
		);

		node.innerHTML = html`
			<div class="col-span-1 px-10 mx-auto">
				<div class="w-full max-w-[100px] overflow-hidden rounded-full aspect-square bg-zine">
					<img src="${review.avatar}" alt="avatar" class="object-cover w-full h-full" />
				</div>
				<div class="text-center">
					<h5 class="mt-4 font-bold">${review.name}</h5>
					<span class="text-sm text-gray-600">${review.count} Ulasan</span>
				</div>
			</div>
			<div class="col-span-1 xl:col-span-3">
				<div
					class="relative w-full p-4 bg-white border-2 border-zine rounded-xl after:content-[''] after:absolute after:border-[20px] after:border-transparent after:border-b-zine xl:after:border-b-transparent xl:after:border-r-zine xl:after:top-[20px] xl:after:-left-[40px] after:-z-10 after:-top-[40px] after:left-1/2 after:transform after:-translate-x-1/2 xl:after:transform-none">
					<div class="flex items-start justify-between">
						<div class="flex flex-col">
							<h4 class="font-bold">${review.title}</h4>
							<span class="text-sm text-gray-600">${review.helpful} Orang Terbantu</span>
						</div>
						<span class="text-sm text-gray-600">${relativeTime(review.timestamp)}</span>
					</div>
					<p class="mt-6 text-sm text-gray-600 w-4/5">${review.body}</p>

					<div id="more" class="hidden mt-6 text-sm text-gray-600 w-4/5">
						<div class="flex">
							<p class="w-full text-sm font-bold">Menu yang di pesan</p>
							<p class="w-full text-sm">${review.menu}</p>
						</div>
						<div class="flex">
							<p class="w-full text-sm font-bold">Tanggal kunjungan</p>	
							<p class="w-full text-sm">${relativeTime(review.visit)}</p>
						</div>
						<div class="flex">
							<p class="w-full text-sm font-bold">Harga per orang</p>
							<p class="w-full text-sm">${review.price}</p>
						</div>
					</div>
					<button class="absolute bottom-0 right-0 m-2 px-2" id="reveal">
						<span class="material-symbols-outlined text-sm"> more_horiz </span>
					</button>
				</div>
			</div>
			<div class="order-first xl:order-last xl:col-span-2">
				<div class="w-full aspect-video rounded-xl overflow-hidden">
				<div class="splide">
					<div class="splide__track">
						<ul class="splide__list" id="images">
						</ul>
					</div>
				</div>
				</div>
			</div>
		`;

		const images = node.querySelector('#images');
		review.images.forEach((image) => {
			const li = document.createElement('li');
			li.classList.add('splide__slide');
			li.innerHTML = html`
				<img src="${image}" alt="food" class="object-cover w-full h-full" />
			`;
			images.appendChild(li);
		});

		const reveal = node.querySelector('#reveal');
		const more = node.querySelector('#more');
		reveal.addEventListener('click', () => {
			more.classList.toggle('hidden');
		});

		container.appendChild(node);
	});

	// multiple splide
	const Splide = window.Splide;
	const splides = document.querySelectorAll('.splide');
	splides.forEach((splide) => {
		const splideInstance = new Splide(splide, {
			type: 'loop',
			autoplay: true,
		});
		splideInstance.mount();
	});
};
