const AW = {};

AW.FANCYBOX_DEFAULTS = {
  hideScrollbar: false,
  Hash: false,
  Thumbs: {
    type: 'classic',
  },
  Toolbar: {
    display: {
      left: ['infobar'],
      middle: [
        'zoomIn',
        'zoomOut',
      ],
      right: ['close'],
    },
  },
}

AW.initMask = function ($field) {
  const type = $field.attr('data-mask');
  switch (type) {
    case 'phone':
      IMask($field[0], {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
        placeholderChar: '_'
      });
      break;
  }
};

AW.StepCounter = class {
  /**
   * Constructor function for creating an instance of the class.
   *
   * @param {jQuery} $element - The jQuery element to bind the functionality to.
   * @param {function} callback - The callback function to be executed on value change.
   * @throws {Error} Throws an error if the element is not found.
   * @return {void}
   */
  constructor($element, callback) {
    if (!$element) throw Error('Element not found!');
    this.element = $element;
    this.callback = callback || null;
    this.btnIncreaseElement = $element.find('[data-stepcounter="+"]');
    this.btnDecreaseElement = $element.find('[data-stepcounter="-"]');
    this.fieldElement = $element.find('[data-stepcounter-input]');
    this.valueElement = $element.find('[data-stepcounter-value]');

    this.maxValue = Number(this.fieldElement.attr('max')) || 10000;
    this.minValue = Number(this.fieldElement.attr('min')) || 0;
    this.step = Number(this.fieldElement.attr('step')) || 1;
    this.value = Number(this.fieldElement.val());

    this.btnIncreaseElement.on('click', this.handleBtnIncrease.bind(this));
    this.btnDecreaseElement.on('click', this.handleBtnDecrease.bind(this));

    this.validateValue(this.value);
  }

  /**
   * Handles the click event of the increase button.
   *
   * @param {Event} event - The click event object.
   * @return {undefined} This function does not return a value.
   */
  handleBtnIncrease(event) {
    event.preventDefault();
    this.updateValue(this.value + this.step);
  }

  /**
   * Handles the click event of the decrease button.
   *
   * @param {Event} event - The click event object.
   * @return {undefined} This function does not return a value.
   */
  handleBtnDecrease(event) {
    event.preventDefault();
    this.updateValue(this.value - this.step);
  }

  /**
   * Updates the value of the object and renders it.
   *
   * @param {number} newValue - The new value to be assigned.
   * @param {boolean} noValidate - Flag indicating whether the value should be validated. Defaults to false.
   */
  updateValue(newValue, noValidate = false) {
    const validatedValue = noValidate ? newValue : this.validateValue(newValue);
    this.value = validatedValue;
    this.renderValue(this.value);
    if (this.callback) {
      this.callback(this.value);
    }
  }

  /**
   * Disables a button based on the given parameter.
   *
   * @param {string} btn - The button to enable. It can be either 'increase' or 'decrease'.
   */
  disableBtn(btn) {
    if (btn === 'increase') {
      this.btnIncreaseElement.attr('disabled', true);
    }
    if (btn === 'decrease') {
      this.btnDecreaseElement.attr('disabled', true);
    }
  }

  /**
   * Enables a button based on the given parameter.
   *
   * @param {string} btn - The button to enable. It can be either 'increase' or 'decrease'.
   */
  enableBtn(btn) {
    if (btn === 'increase') {
      this.btnIncreaseElement.attr('disabled', false);
    }
    if (btn === 'decrease') {
      this.btnDecreaseElement.attr('disabled', false);
    }
  }

  /**
   * Validates the given value based on the minimum and maximum values.
   *
   * @param {number} value - The value to be validated.
   * @return {number} The validated value within the specified range.
   */
  validateValue(value) {
    let validatedValue;
    if (value >= this.maxValue) {
      validatedValue = this.maxValue;
      this.disableBtn('increase');
    } else if (value <= this.minValue) {
      validatedValue = this.minValue;
      this.disableBtn('decrease');
    } else {
      validatedValue = value;
      this.enableBtn('increase');
      this.enableBtn('decrease');
    }
    return validatedValue;
  }

  /**
   * Renders the value by updating the field element's value
   * and the value element's text.
   *
   * @param {Number} value - The value to be rendered.
   */
  renderValue(value) {
    this.fieldElement.val(value);
    this.valueElement.text(value);
  }

  /**
   * Retrieves the current value.
   *
   * @return {number} The current value.
   */
  getCurrentValue() {
    return this.value;
  }

  /**
   * This function destroys the event listeners for the button elements.
   */
  destroy() {
    this.btnIncreaseElement.off('click', this.handleBtnIncrease.bind(this));
    this.btnDecreaseElement.off('click', this.handleBtnDecrease.bind(this));
  }
};

$(document).ready(() => {
  Fancybox.defaults.Hash = false;
  Fancybox.defaults.l10n = {
    CLOSE: 'Закрыть',
    NEXT: 'Следующий',
    PREV: 'Предыдущий',
    MODAL: 'Вы можете закрыть это окно нажав на клавишу ESC',
    ERROR: 'Что-то пошло не так, пожалуйста, попробуйте еще раз',
    IMAGE_ERROR: 'Изображение не найдено',
    ELEMENT_NOT_FOUND: 'HTML элемент не найден',
    AJAX_NOT_FOUND: 'Ошибка загрузки AJAX : Не найдено',
    AJAX_FORBIDDEN: 'Ошибка загрузки AJAX : Нет доступа',
    IFRAME_ERROR: 'Ошибка загрузки страницы',
    ZOOMIN: 'Увеличить',
    ZOOMOUT: 'Уменьшить',
    TOGGLE_THUMBS: 'Галерея',
    TOGGLE_SLIDESHOW: 'Слайдшоу',
    TOGGLE_FULLSCREEN: 'На весь экран',
    DOWNLOAD: 'Скачать'
  };

  Fancybox.bind('[data-fancybox]', AW.FANCYBOX_DEFAULTS);

  // Этот хак помогает избежать прыжков анимации при загрузке страницы
  $('body').removeClass('preload');

  $('[data-stepcounter]').each(function () {
    new AW.StepCounter($(this));
  });

  $('[data-select1]').each(function () {
    new TomSelect($(this)[0], {
      controlInput: null,
      create: true,
      render: {
        item: function (data, escape) {
          return `
            <div class="item">
              ${escape(data.text)}
            </div>
          `;
        },
      },
      onInitialize: function () {
        $(this.control).append(`
          <svg aria-hidden="true" width="10" height="6">
            <use xlink:href="img/sprite.svg#chevron2"></use>
          </svg>
        `);
      }
    });
  });

  $('[data-expandable-handle]').click(function () {
    const $parent = $(this).closest('[data-expandable]');
    const $accordion = $(this).closest('[data-container="accordion"]');
    if ($parent.attr('data-expandable') === 'collapsed') {
      $accordion.find('[data-expandable="expanded"] [data-expandable-clip]').css('overflow', 'hidden');
      $accordion.find('[data-expandable="expanded"]').attr('data-expandable', 'collapsed');
      $parent.attr('data-expandable', 'expanded');
      setTimeout(() => {
        // Небольшой костыль для ровной работы экспандера
        $parent.find('[data-expandable-clip]').css('overflow', 'visible');
      }, 250);
    } else {
      $parent.find('[data-expandable-clip]').css('overflow', 'hidden');
      $parent.attr('data-expandable', 'collapsed');
    }
  });

  $('body').on('click', function (event) {
    if (
      $('.dd-header-catalog').hasClass('dd-header-catalog_active')
      &&
      $(event.target).attr('data-action') !== 'showHeaderCatalog'
      &&
      $(event.target).closest('[data-action="showHeaderCatalog"]').length === 0
      &&
      $(event.target).closest('.dd-header-catalog').length === 0
      &&
      !$(event.target).hasClass('dd-header-catalog')
    ) {
      hideHeaderCatalog();
    }
  });

  $('body').on('click', '[data-action]', function (event) {
    const alias = $(this).attr('data-action');

    switch (alias) {
      case 'testAction': {

        break;
      }
    }
  });

  $('body').on('input', '[data-action-input]', function (event) {
    const alias = $(this).attr('data-action-input');

    switch (alias) {
      case 'testAction': {

        break;
      }
    }
  });

  function indents() {
    const header = document.querySelector('.header');
    const page = document.querySelector('.main');

    //Оступ от шапки
    let hHeader = window.getComputedStyle(header, false).height;
    hHeader = Number(hHeader.slice(0, hHeader.length - 2));
    if (page) {
      page.style.paddingTop = hHeader + 'px';
    }

  }
  window.addEventListener('scroll', () => {
    indents();
  });
  window.addEventListener('resize', () => {
    indents();
  });
  indents();

  //Меню
  function menuInit() {
    if (document.querySelector(".header__icon")) {
      document.addEventListener("click", function (e) {
        if (e.target.closest('.header__icon')) {
          document.documentElement.classList.toggle("menu-open");
          document.body.classList.toggle("noscroll");
        }
      });
    }
  }
  menuInit()

  //Слайдер

  AW.initSliderIntro = function ($el) {
    const $wrapper = $('[data-swiper-wrapper="intro"]');
    const $navNext = $wrapper.find('.block-intro__nav-next');
    const $navPrev = $wrapper.find('.block-intro__nav-prev');

    const swiper = new Swiper($el[0], {
      spaceBetween: 0,
      slidesPerView: 1,
      speed: 200,
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      on: {
        init: function () {
          updatePagination(this.activeIndex, $wrapper); // Передаем $wrapper вместо $el
        },
        slideChange: function () {
          updatePagination(this.activeIndex, $wrapper); // Передаем $wrapper
        },
      },
    });

    let lastWindowWidth = window.innerWidth;

    $(window).on('resize', function () {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWindowWidth) {
        updatePagination(swiper.activeIndex, $wrapper);
      }
      lastWindowWidth = currentWidth;
    });

    return swiper;
  };

  function updatePagination(activeIndex, $wrapper) {
    const paginationItems = $wrapper.find('.block-intro__pagination-item');

    if (!paginationItems.length) {
      console.warn('Пункты пагинации не найдены!');
      return;
    }

    // Удаляем _active у всех пунктов
    paginationItems.removeClass('_active');

    // Добавляем _active только активному
    paginationItems.eq(activeIndex).addClass('_active');

    // === Показываем только видимый диапазон (по желанию) ===
    const visibleRange = getVisibleRange(window.innerWidth);
    const halfRange = Math.floor(visibleRange / 2);

    let start = activeIndex - halfRange;
    let end = activeIndex + halfRange;

    const totalItems = paginationItems.length;

    if (start < 0) {
      end -= start;
      start = 0;
    }
    if (end >= totalItems) {
      start -= (end - totalItems + 1);
      end = totalItems - 1;
    }

    // Показываем/скрываем пункты в зависимости от диапазона
    paginationItems.each(function (index) {
      $(this).toggle(index >= start && index <= end);
    });
  }

  // Функция для определения видимого диапазона
  function getVisibleRange(windowWidth) {
    if (windowWidth >= 992) { // Desktop
      return 3;
    } else if (windowWidth >= 768) { // Tablet
      return 2;
    } else { // Mobile
      return 1;
    }
  }

  $('[data-swiper="intro"]').each(function () {
    AW.initSliderIntro($(this));
  });


  //Форма
  document.querySelectorAll('.form-group').forEach(group => {
    const input = group.querySelector('.field-input1');
    const label = group.querySelector('.form-group__label');

    function updateLabel() {
      if (input.value.trim() !== '' || document.activeElement === input) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    }

    // События
    input.addEventListener('input', updateLabel);
    input.addEventListener('focus', updateLabel);
    input.addEventListener('blur', updateLabel);

    // Инициальная проверка
    updateLabel();
  });

  AW.validateForm = function ($el) {
    if ($el.length === 0) return;

    const validator = $el.validate({
      ignore: [],
      errorClass: 'form-group__error',
      errorPlacement: function (error, element) {
        const $parent = $(element).closest('.form-group');
        $parent.append(error);
      },
      highlight: function (element) {
        const $parent = $(element).closest('.form-group');
        $parent.addClass('form-group_error');
      },
      unhighlight: function (element) {
        const $parent = $(element).closest('.form-group');
        $parent.removeClass('form-group_error');
      },
      submitHandler: function (form, event) {
        event.preventDefault();
        const trigger = $el.attr('data-onsubmit-trigger');
        if (trigger) {
          $(document).trigger(trigger, { event, form });
        } else {
          form.submit();
        }
      }
    });

    $el.find('.field-input1, .field-input2, .checkbox__input, select').each(function () {
      if ($(this).is(':required')) {
        $(this).rules('add', {
          required: true,
          messages: {
            required: 'Заполните это поле',
          }
        });
      }

      if ($(this).attr('data-type') === 'phone') {
        $(this).rules('add', {
          mobileRu: true,
          messages: {
            mobileRu: 'Неверный формат',
          }
        });
      }

      if ($(this).attr('data-type') === 'email') {
        $(this).rules('add', {
          email: true,
          messages: {
            email: 'Неверный формат',
          }
        });
      }
    });

    return validator;
  }

  $('[data-validate]').each(function () {
    AW.validateForm($(this));
  });


  document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card-product');
    const allButtons = document.querySelectorAll('.heading-complex__button-filter');

    // Общая функция фильтрации
    function applyFilter(selectedFilter) {
      cards.forEach(card => {
        const cardType = card.getAttribute('data-product');
        if (selectedFilter === 'all' || cardType === selectedFilter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Обновляем класс active у всех кнопок
      allButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter === selectedFilter);
      });
    }

    // Назначаем обработчики клика
    allButtons.forEach(button => {
      button.addEventListener('click', function () {
        const filter = this.dataset.filter;
        applyFilter(filter);
      });
    });

    // По умолчанию — показываем хиты продаж
    applyFilter('hit');
  });
});

//========================================================================================================================================================

