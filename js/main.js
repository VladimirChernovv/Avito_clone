'use strict';

const dataBase = [];

const modalAdd = document.querySelector('.modal__add'),
	addAd = document.querySelector('.add__ad'),
	modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	modalSubmit = document.querySelector('.modal__submit'),
	catalog = document.querySelector('.catalog'),
	modalItem = document.querySelector('.modal__item'),
	modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit = [...modalSubmit.elements]
	.filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');
	
const closeModal = function(event) {
	const target = event.target;
	// console.log(this);

	if (target.closest('.modal__close') || target === this) {
		this.classList.add('hide');
		if (this === modalAdd) {
			// Когда мы закрываем форму, мы её очищаем
			modalSubmit.reset();
		};
	};
};

// Закрытие модалки по нажатию клавиши ESC
const closeModalEsc = event => {
	// Отслеживаем нажатие только на клавишу ESC
	if (event.code === 'Escape') {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		modalSubmit.reset();
		// Удаляем события как только оно сработало
		document.removeEventListener('keydown', closeModalEsc);
	};
};

// Навешиваем на форму Submit события
modalSubmit.addEventListener('input', () => {
	const validForm = elementsModalSubmit.every(elem => elem.value);
	// Разблокируем кнопку 'Отправить' при заполнении всех полей в форме
	modalBtnSubmit.disabled = !validForm;
	// Скрываем или показываем надпись 'Заполните поля' modal__btn-warning
	modalBtnWarning.style.display = validForm ? 'none' : '';
});

// Блокируем перезагрузку страницы при нажатии кнопки 'Отправить' в модальном окне 'Подать объявление'
modalSubmit.addEventListener('submit', event => {
	// С помощью этого мотода обновляем стандартную функцию обновления страницы при нажатии на кнопку отправить
	event.preventDefault();
	// Создаём массив в котором будут все данные товара 
	const itemObj = {};
	// Перебираем все данные формы и добавляем в новый объект
	for (const elem of elementsModalSubmit) {
		itemObj[elem.name] = elem.value;
		console.log(elem.name);
		console.log(elem.value);
	}

	// Добавляем выбранное в dataBase
	dataBase.push(itemObj);
});

// При нажатии на кнопку 'Подать объявление' удаляется класс hide и появляется всплывающее окно
addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	// Делаем кнопку 'Отправить' не кликабельной при начальном открытии модального окна
	modalBtnSubmit.disabled = true;
	// Закрытие модалки по нажатию клавиши ESC
	document.addEventListener('keydown', closeModalEsc);
});

catalog.addEventListener('click', event => {
	const target = event.target;
	if (target.closest('.card')) {
		// При клике на карточку всплывает модальное окно
		modalItem.classList.remove('hide');
		// Закрытие модалки по нажатию клавиши ESC
		document.addEventListener('keydown', closeModalEsc);
	};
});


// Закрытие модпльного окна при нажатии на крестик или мимо окна
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);