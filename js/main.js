'use strict';

const modalAdd = document.querySelector('.modal__add'),
	addAd = document.querySelector('.add__ad'),
	modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	modalSubmit = document.querySelector('.modal__submit');

// При нажатии на кнопку 'Подать объявление' удаляется класс hide и появляется всплывающее окно
addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	// Делаем кнопку 'Отправить' не кликабельной при начальном открытии модального окна
	modalBtnSubmit.disabled = true;
});

// Закрытие модпльного окна при нажатии на крестик или мимо окна
modalAdd.addEventListener('click', (event) => {
	const target = event.target;

	if (target.classList.contains('modal__close') ||
		target === modalAdd) {
		modalAdd.classList.add('hide');
		// Когда мы закрываем форму, мы её очищаем
		modalSubmit.reset();
	}
});