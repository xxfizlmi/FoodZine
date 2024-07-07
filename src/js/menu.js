const html = String.raw;

document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');

	const name = document.querySelector('#name');
	const detail = document.querySelector('#detail');

	const menus = document.querySelector('#menus');
	const preview = document.querySelector('#preview');

	fetch(`http://localhost:3000/restaurants/${id}`)
		.then((response) => response.json())
		.then(async (data) => {
			const delay = 500;
			await new Promise((resolve) => setTimeout(resolve, delay));

			name.textContent = data.name;
			detail.textContent = `Restaurant ${data.name} | ${data.address} | ${data.type}`;

			renderMenu(menus, preview, data.menus);
			console.log(data.menus);
		})
		.catch((error) => {
			alert(`Error: ${error}`);
			window.history.back();
		});
});

const renderMenu = (menus, preview, data) => {
	menus.innerHTML = '';
	preview.innerHTML = '';

	const random = Math.floor(Math.random() * data.length);
	preview.innerHTML = html` <img src="${data[random]}" alt="menu" class="w-full max-w-screen-lg rounded-xl mx-auto" /> `;

	data.forEach((menu) => {
		const node = document.createElement('div');
		node.classList.add('flex', 'items-center', 'text-sm', 'space-x-2');
		node.innerHTML = html` <img src="${menu}" alt="menu" class="w-20 rounded-lg cursor-pointer aspect-square" /> `;
		menus.appendChild(node);
	});

	menus.addEventListener('click', (event) => {
		if (event.target.classList.contains('aspect-square')) {
			preview.innerHTML = html` <img src="${event.target.src}" alt="menu" class="w-full max-w-screen-lg rounded-xl mx-auto" /> `;
		}
	});
};
