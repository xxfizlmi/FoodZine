const html = String.raw;

document.addEventListener('DOMContentLoaded', async () => {
	try {
		var response = await fetch('http://localhost:3000/restaurants');
		var restaurants = await response.json();
	} catch (error) {
		console.log(error);
	}

	const popular = restaurants.sort((a, b) => b.rating - a.rating).slice(0, 3);
	const latest = restaurants.sort((a, b) => a.id - b.id).slice(0, 3);

	renderRestaurant(document.querySelector('#populars'), popular);
	renderRestaurant(document.querySelector('#latests'), latest);
	randerSingle(
		document.querySelector('#single'),
		document.querySelector('#lihat'),
		restaurants
	);

	const pernah = document.querySelector('#pernah');
	pernah.addEventListener('click', () => {
		randerSingle(
			document.querySelector('#single'),
			document.querySelector('#lihat'),
			restaurants
		);
	});

	Promise.all([
		fetch('http://localhost:3000/foods?_limit=4'),
		fetch('http://localhost:3000/universities'),
		fetch('http://localhost:3000/categories'),
		fetch('http://localhost:3000/reviews'),
	])
		.then((responses) =>
			Promise.all(responses.map((response) => response.json()))
		)
		.then(async ([foods, universities, categories, reviews]) => {
			const delay = 500;
			await new Promise((resolve) => setTimeout(resolve, delay));

			renderFood(document.querySelector('#foods'), foods);
			renderUniversity(
				document.querySelector('#universities ul'),
				universities
			);
			renderCategory(document.querySelector('#categories'), categories);
			renderReview(document.querySelector('#reviews ul'), reviews);
		})
		.catch((error) => console.log(error));
});

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
		const node = document.createElement('li');
		node.classList.add(
			'flex',
			'items-center',
			'justify-center',
			'splide__slide'
		);
		node.innerHTML = html`
			<div class="w-full max-w-[600px] p-8 shadow-md bg-white rounded-xl grid grid-cols-3">
				<div class="flex flex-col items-center col-span-1">
					<div class="w-[100px] aspect-square rounded-full overflow-hidden">
						<img src="${review.avatar}" alt="avatar" class="object-cover w-full h-full" />
					</div>
					<h3 class="mt-2 font-bold">${review.name}</h3>
					<p class="text-sm text-zinc-600">${review.count} Reviews</p>
				</div>
				<div class="col-span-2">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-bold">${review.title}</h3>
							<p class="text-sm text-zinc-600">${review.helpful} Orang Terbantu</p>
						</div>
						<p class="text-sm">${relativeTime(review.timestamp)}</p>
					</div>
					<p class="mt-6 text-sm">${review.body}</p>
				</div>
			</div>
		`;
		container.appendChild(node);
	});

	const Splide = window.Splide;
	const splide = new Splide('#reviews .splide', {
		type: 'loop',
		autoplay: true,
	});

	splide.mount();
};

const renderRestaurant = (container, data) => {
	container.innerHTML = '';

	data.forEach((restaurant) => {
		const node = document.createElement('a');
		node.setAttribute('href', `restaurant.html?id=${restaurant.id}`);
		node.classList.add('rounded-xl', 'overflow-hidden');
		node.innerHTML = html`<img src="${restaurant.image}" alt="image" class="w-full h-[250px] object-cover" />`;
		container.appendChild(node);
	});
};

const renderUniversity = (container, data) => {
	container.innerHTML = '';

	data.forEach((university) => {
		const node = document.createElement('li');
		node.classList.add('splide__slide', '-mb-6');
		node.innerHTML = html`
			<div class="w-full aspect-square rounded-full overflow-hidden">
				<img src="${university.image}" alt="university" class="w-full h-full object-cover" />
			</div>
			<h5 class="w-full font-bold text-sm mt-2 text-center">${university.name}</h5>
		`;
		container.appendChild(node);
	});

	const Splide = window.Splide;
	const splide = new Splide('#universities .splide', {
		type: 'loop',
		perPage: 4,
		perMove: 1,
		gap: '3rem',
		breakpoints: {
			1024: {
				perPage: 3,
				gap: '3rem',
			},
			768: {
				perPage: 2,
				gap: '2rem',
			},
		},
	});

	splide.mount();
};

const renderCategory = (container, data) => {
	container.innerHTML = '';

	data.forEach((category) => {
		const node = document.createElement('a');
		node.setAttribute('href', `#`);
		node.classList.add(
			'bg-zine-dark',
			'hover:bg-zine',
			'rounded-lg',
			'px-3',
			'py-5',
			'flex',
			'items-center',
			'text-sm'
		);
		node.innerHTML = html`
			<span class="material-symbols-outlined mr-3"> ${category.icon} </span>
			<span class="font-bold">${category.name}</span>
		`;
		container.appendChild(node);
	});
};

const renderFood = (container, data) => {
	container.innerHTML = '';

	data.forEach((food, index) => {
		const foodElement = document.createElement('a');
		foodElement.setAttribute(
			'href',
			`restaurant.html?id=${food.restaurant}`
		);
		foodElement.classList.add('rounded-xl', 'overflow-hidden', 'relative');
		if (index === data.length - 1) {
			foodElement.innerHTML = html`
				<a
				href="foods.html"
				class="absolute w-full h-full bg-zine bg-opacity-50 z-10 flex items-center justify-center">
					<h5 class="text-white font-bold text-2xl">Lihat Lebih Banyak</h5>
				</a>
				<img src="${food.image}" alt="image" class="w-full aspect-[16/10] object-cover" />
			`;
		} else {
			foodElement.innerHTML = html`
				<img src="${food.image}" alt="image" class="w-full aspect-[16/10] object-cover" />
			`;
		}
		container.appendChild(foodElement);
	});
};

const randerSingle = (container, button, restaurants) => {
	const random = restaurants[Math.floor(Math.random() * restaurants.length)];

	container.innerHTML = html`
		<div class="flex items-center p-0.5">
			<div class="w-full p-3 font-bold text-sm">
				<h5 class="line-clamp-1">${random.name}</h5>
				<p class="text-white line-clamp-1">${random.address}</p>
			</div>
			<div class="w-16 flex flex-shrink-0 items-center justify-center bg-white aspect-square rounded-tr-md">
				<span class="text-zine text-lg font-bold">${random.rating}</span>
			</div>
		</div>
		<img src="${random.image}" alt="bakso" class="w-full aspect-square object-cover" />
	`;

	button.setAttribute('href', `restaurant.html?id=${random.id}`);
};
