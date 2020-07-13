'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

const modalAdd = document.querySelector('.modal__add'),
	addAd = document.querySelector('.add__ad'),
	modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	modalSubmit = document.querySelector('.modal__submit'),
	catalog = document.querySelector('.catalog'),
	modalItem = document.querySelector('.modal__item'),
	modalBtnWarning = document.querySelector('.modal__btn-warning'),
	modalFileInput = document.querySelector('.modal__file-input'),
	modalFileBtn = document.querySelector('.modal__file-btn'),
	modalImageAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements]
	.filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

// Здесь мы храним данные выбранного фото в модальном окне 'Подать объявление' по нажатию на кнопку 'Добавить фото'
const infoPhoto = {};

// Функция которая сохраняет всё в браузере, а именно в localStorage. И переменную const dataBase = []; мы будем п=отправлять в localStorage
const saveDataBase = () => localStorage.setItem('awito', JSON.stringify(dataBase));

// Перебираем все эелементы которые есть в форме и проверяем что они заполнены, если заполнены every вернёт нам true в validForm
const checkForm = () => {
	const validForm = elementsModalSubmit.every(elem => elem.value);
	// Разблокируем кнопку 'Отправить' при заполнении всех полей в форме
	modalBtnSubmit.disabled = !validForm;
	// Скрываем или показываем надпись 'Заполните поля' modal__btn-warning
	modalBtnWarning.style.display = validForm ? 'none' : '';
}

// Функиция которая закрывает. Закрывает в случае если мы нажали на кнопку .modal__close или если мы кликаем не на модальное окно modal(в любую его область) , а за его границами - на подложку, тогда происходит закрытие или если мы кликаем Escape, тоже происходит закрытие
const closeModal = event => {
	const target = event.target;

	// Здесь мы реализуем закрытие двух модальных окон: 1)При нажатии на кнопку 'Подать объявление' - modalAdd, 2)При нажатии на карточку - modalItem
	if (target.closest('.modal__close') ||
		target.classList.contains('modal') ||
		event.code === 'Escape') {
			modalAdd.classList.add('hide');
			modalItem.classList.add('hide');
			// Очишаем форму
			document.removeEventListener('keydown', closeModal);
			// При закрытии модального окна 'Подать объявление' и повторном открытии форма показывается в первоначальном заполнении
			modalSubmit.reset();
			// При закрытии модального окна(чтоб при новом открытии окна эти елименты были были с изначальным значением) удаляем выбранное фото
			modalImageAdd.src = srcModalImage;
			// При закрытии модального окна(чтоб при новом открытии окна эти елименты были с изначальным значением) удаляем название выбранного фото
			modalFileBtn.textContent = textFileBtn;
			checkForm();
		};
};

modalFileInput.addEventListener('change', event => {
	const target = event.target;

	const reader = new FileReader();

	const file = target.files[0];

	infoPhoto.filename = file.name;
	infoPhoto.size = file.size;

	// Метод отслеживающий когда появился файл и сразу начнёт считывать его содержимое
	reader.readAsBinaryString(file);

	// При выборе фото на кнопке 'Добавить фото', эта кнопка переименуется на название выбранного фото
	reader.addEventListener('load', event => {
		// Делаем ограничение по размеру фото
		if (infoPhoto.size < 200000) {
			// Добавляем фото
			modalFileBtn.textContent = infoPhoto.filename;
			// Здесь мы конвертируем картинку в строку
			infoPhoto.base64 = btoa(event.target.result);
			// При выборе картинки указываем её адрес и ставим её фоновой
			modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
		} else {
			modalFileBtn.textContent = 'Файл не должен привышать 200кб';
		}

		
	});

	
});

// Навешиваем на форму Submit события
modalSubmit.addEventListener('input', checkForm);

// Блокируем стандартное браузерное поведение(перезагрузка) страницы при нажатии кнопки 'Отправить' в модальном окне 'Подать объявление'
modalSubmit.addEventListener('submit', event => {
	// С помощью этого мотода обновляем стандартную функцию обновления страницы при нажатии на кнопку отправить
	event.preventDefault();
	// Создаём объект в котором будут все элементы модального окна
	const itemObj = {};
	// Перебираем все данные формы и добавляем в новый объект
	for (const elem of elementsModalSubmit) {
		// Забираем имя и свойство
		itemObj[elem.name] = elem.value;
	};

	// Добавляем картинку в базу данных
	itemObj.image = infoPhoto.base64;
	// Добавляем объект который создали
	dataBase.push(itemObj);
	// Закрываем модальное окно. И чтобы обмануть нашу функцию, мы создаём здесь объект
	closeModal({target: modalAdd});
	saveDataBase();
});

// При нажатии на кнопку 'Подать объявление' удаляется класс hide и появляется всплывающее окно
addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	// Делаем кнопку 'Отправить' не кликабельной при начальном открытии модального окна
	modalBtnSubmit.disabled = true;
	// Закрытие модалки по нажатию клавиши ESC
	document.addEventListener('keydown', closeModal);
});

// Когда мы кликаем на карточки товара мы их фильтруем через closest и открываем модальное окно
catalog.addEventListener('click', event => {
	const target = event.target;
	if (target.closest('.card')) {
		// При клике на карточку всплывает модальное окно
		modalItem.classList.remove('hide');
		// Закрытие модалки по нажатию клавиши ESC
		document.addEventListener('keydown', closeModal);
	};
});


// Закрытие модпльного окна при нажатии на крестик или мимо окна
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);