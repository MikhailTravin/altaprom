const AW = {};

AW.modal = new HystModal({
  linkAttributeName: "data-hystmodal",
  closeOnOverlay: false,
  afterClose: (modal) => {
    // switch ($(modal.element).attr('id')) {
    //   case 'modalConfirm': {
    //     $('#modalConfirm [data-confirm-ok]').off('click');
    //     $('#modalConfirm [data-confirm-cancel]').off('click');
    //     break;
    //   }

    //   case 'modalVacancy': {
    //     AW.resetForm($('#modalVacancy form'));
    //     break;
    //   }
    // }
  },
});

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

    const thumbsSwiper = new Swiper('.swiper-intro-pagination', {
      loop: true,
      slidesPerView: 3,
      watchSlidesProgress: true,
      speed: 400,
      allowTouchMove: false,
      centeredSlides: true,
      breakpoints: {
        0: { slidesPerView: 1, centeredSlides: false },
        550: { slidesPerView: 2, centeredSlides: false },
        992: { slidesPerView: 3, centeredSlides: true }
      },
      on: {
        init: function () {
          this.update();
        }
      }
    });

    const mainSwiper = new Swiper('.swiper-intro', {
      loop: true,
      slidesPerView: 1,
      speed: 400,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      on: {
        slideChange: function () {
          thumbsSwiper.slideToLoop(this.realIndex);
        }
      }
    });
  };
  $('[data-swiper="intro"]').each(function () {
    AW.initSliderIntro($(this));
  });

  AW.initSliderCatalog = function ($el) {
    const $buttonsContainer = $el.closest('.nav-catalog-detail__buttons');
    const $navNext = $buttonsContainer.find('.swiper-nav_next');
    const $navPrev = $buttonsContainer.find('.swiper-nav_prev');
    const $slider = $buttonsContainer.find('.nav-catalog-detail__slider');

    let swiperInstance = null;

    function initSwiper() {
      if (window.innerWidth < 992) {
        if (!swiperInstance) {
          swiperInstance = new Swiper($slider[0], {
            loop: false, // Важно отключить loop для корректной работы
            slidesPerView: 'auto',
            speed: 400,
            spaceBetween: 8,
            navigation: {
              nextEl: $navNext[0],
              prevEl: $navPrev[0],
            },
            on: {
              init: function () {
                updateContainerClasses(this);
              },
              slideChange: function () {
                updateContainerClasses(this);
              },
              reachEnd: function () {
                $buttonsContainer.addClass('slider-at-end');
              },
              reachBeginning: function () {
                $buttonsContainer.removeClass('slider-at-end');
              },
              fromEdge: function () {
                updateContainerClasses(this);
              }
            }
          });
        }
      } else {
        if (swiperInstance) {
          swiperInstance.destroy(true, true);
          swiperInstance = null;
          $buttonsContainer.removeClass('slider-at-end');
        }
      }
    }

    function updateContainerClasses(swiper) {
      if (swiper.isEnd) {
        $buttonsContainer.addClass('slider-at-end');
      } else {
        $buttonsContainer.removeClass('slider-at-end');
      }
    }

    // Инициализация при загрузке
    initSwiper();

    // Обработка ресайза с debounce для оптимизации
    let resizeTimeout;
    $(window).on('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        initSwiper();
      }, 250);
    });
  };
  $('[data-swiper="catalog-detail"]').each(function () {
    AW.initSliderCatalog($(this));
  });

  AW.initProductSlider = function ($el) {
    const $wrapper = $('[data-swiper-wrapper="product-card"]');
    const $navNext = $wrapper.find('.swiper-nav_next');
    const $navPrev = $wrapper.find('.swiper-nav_prev');

    // Инициализация миниатюр (thumbs)
    const thumbsSwiper = new Swiper('.swiper-thumbs', {
      observer: true,
      observeParents: true,
      slidesPerView: 4,
      spaceBetween: 20,
      speed: 400,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      breakpoints: {
        0: {
          spaceBetween: 10,
        },
        768: {
          spaceBetween: 20,
        },
      },
    });

    // Инициализация основного слайдера
    const mainSwiper = new Swiper('.swiper-product-card', {
      thumbs: {
        swiper: thumbsSwiper,
      },
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 2,
      speed: 400,
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
    });
  };
  $('[data-swiper="product-card"]').each(function () {
    AW.initProductSlider($(this));
  });

  AW.initProductRecommeded = function ($el) {
    const $wrapper = $('[data-swiper-wrapper="block-recommended"]');
    const $navNext = $wrapper.find('.swiper-nav_next');
    const $navPrev = $wrapper.find('.swiper-nav_prev');

    // Инициализация основного слайдера
    new Swiper('.swiper-recommended', {
      observer: true,
      observeParents: true,
      slidesPerView: 4,
      speed: 400,
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 4,
        },
      },
    });
  };
  $('[data-swiper="block-recommended"]').each(function () {
    AW.initProductRecommeded($(this));
  });

  AW.initSliderComparison = function ($el) {
    const $wrapper = $('[data-swiper-wrapper="swiper-comparison"]');
    const $navNext = $wrapper.find('.swiper-nav_next');
    const $navPrev = $wrapper.find('.swiper-nav_prev');
    const $scrollbar = $wrapper.find('.swiper-scrollbar'); // Находим скроллбар

    // Инициализация слайдера с скроллбаром
    new Swiper('.swiper-comparison', {
      observer: true,
      observeParents: true,
      slidesPerView: 5,
      speed: 400,
      navigation: {
        nextEl: $navNext[0],
        prevEl: $navPrev[0],
      },
      scrollbar: {
        el: $scrollbar[0],
        draggable: true,
        hide: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 0.9,
        },
        375: {
          slidesPerView: 1.9,
        },
        992: {
          slidesPerView: 3,
        },
        1400: {
          slidesPerView: 5,
        },
      },
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      on: {
        init: syncRowHeights,
        slideChange: syncRowHeights
      }
    });
  };
  $('[data-swiper="swiper-comparison"]').each(function () {
    AW.initSliderComparison($(this));
  });

  const button = document.querySelector('.search__button');
  const closeBtn = document.querySelector('.search__delete');
  const searchBody = document.querySelector('.search__body');

  // Функция открытия поиска
  function openSearch() {
    document.documentElement.classList.toggle('search-open');
  }

  // Функция закрытия поиска
  function closeSearch() {
    document.documentElement.classList.remove('search-open');
  }

  // Обработчики клика на кнопки
  if (button) {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      openSearch();
    });
  }

  // Закрытие по клику вне области поиска
  document.addEventListener('click', function (e) {
    if (!searchBody.contains(e.target) && !button.contains(e.target)) {
      closeSearch();
    }
  });

  const imageElement = document.getElementById('submenuImage');
  const defaultSrc = imageElement.src;

  // Находим все .menu__sublink, которые имеют data-img
  const links = document.querySelectorAll('[data-img]');

  links.forEach(link => {
    link.addEventListener('mouseenter', function () {
      const newSrc = this.getAttribute('data-img');
      imageElement.src = newSrc;
    });

    link.addEventListener('mouseleave', function () {
      imageElement.src = defaultSrc;
    });
  });

  const cartButton = document.querySelector('.block-shopping-cart__button');

  if (cartButton) {
    const cartClose = document.querySelector('.block-shopping-cart__close');
    const shadow = document.querySelector('.shadow');
    // Функция открытия корзины
    function openCart() {
      document.body.classList.add('noscroll');
      document.documentElement.classList.add('shopping-cart-open');
    }

    // Функция закрытия корзины
    function closeCart() {
      document.body.classList.remove('noscroll');
      document.documentElement.classList.remove('shopping-cart-open');
    }

    cartButton.addEventListener('click', openCart);

    if (cartClose) {
      cartClose.addEventListener('click', closeCart);
      shadow.addEventListener('click', closeCart);
    }
  }

  document.querySelectorAll('a[href="#characteristics"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Находим кнопку вкладки "Характеристики" и кликаем по ней
      const tabButton = document.querySelector('[data-tabs="tab1"]');
      if (tabButton) tabButton.click();

      // Прокручиваем к блоку характеристик
      const targetBlock = document.getElementById('characteristics');
      if (targetBlock) {
        targetBlock.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  //Карта
  const map = document.querySelector("#map");
  if (map) {
    if ("undefined" !== typeof ymaps) ymaps.ready((() => initMainMap()));
    else console.warn("Yandex Maps API не загружено для карты #map");
    function initMainMap() {
      try {
        var myMap = new ymaps.Map("map", {
          center: [55.879207, 37.492428],
          zoom: 18,
          controls: ["zoomControl"],
          behaviors: ["drag"]
        }, {
          searchControlProvider: "yandex#search"
        });
        const placemark1 = new ymaps.Placemark([55.879207, 37.492428], {}, {
          iconLayout: "default#image",
          iconImageHref: "img/location.svg",
          iconImageSize: [44, 60],
          iconImageOffset: [20, -10]
        });
        myMap.geoObjects.add(placemark1);
      } catch (error) {
        console.error("Ошибка при инициализации карты #map:", error);
      }
    }
  }

  //Высота
  function syncRowHeights() {
    // Получаем все строки из основной таблицы
    const mainTableRows = document.querySelectorAll('.comparison-tabs__main-table .comparison-tabs__value');
    // Получаем все строки из таблицы сравнения
    const comparisonTableRows = document.querySelectorAll('.comparison-tabs__table .swiper-slide');

    // Сначала сбрасываем все minHeight, чтобы они не влияли на расчеты
    mainTableRows.forEach(row => row.style.minHeight = '');
    comparisonTableRows.forEach(slide => {
      slide.querySelectorAll('.comparison-tabs__value').forEach(row => {
        row.style.minHeight = '';
      });
    });

    // Теперь рассчитываем новые высоты
    mainTableRows.forEach((mainRow, index) => {
      let maxHeight = mainRow.offsetHeight;

      // Находим соответствующую строку в каждом слайде
      comparisonTableRows.forEach(slide => {
        const comparisonRow = slide.querySelectorAll('.comparison-tabs__value')[index];
        if (comparisonRow) {
          maxHeight = Math.max(maxHeight, comparisonRow.offsetHeight);
        }
      });

      // Устанавливаем максимальную высоту для всех соответствующих строк
      mainRow.style.minHeight = `${maxHeight}px`;
      comparisonTableRows.forEach(slide => {
        const comparisonRow = slide.querySelectorAll('.comparison-tabs__value')[index];
        if (comparisonRow) {
          comparisonRow.style.minHeight = `${maxHeight}px`;
        }
      });
    });
  }
  window.addEventListener('load', syncRowHeights);
  window.addEventListener('resize', syncRowHeights);

  //Форма
  document.querySelectorAll('.form-group').forEach(group => {
    const input = group.querySelector('.field-input1');
    const label = group.querySelector('.form-group__label');

    if (input) {
      function updateLabel() {
        if (input.value.trim() !== '' || document.activeElement === input) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
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

  //табы
  const buttons = document.querySelectorAll('.heading-complex__button-filter');
  const contents = document.querySelectorAll('.block-recommended__content');
  function filterProducts(filter) {
    // Удаляем класс active у всех кнопок
    buttons.forEach(btn => btn.classList.remove('active'));

    // Добавляем active к выбранной кнопке (с тем же data-filter)
    document.querySelectorAll(`.heading-complex__button-filter[data-filter="${filter}"]`)
      .forEach(btn => btn.classList.add('active'));

    // Скрываем все блоки контента
    contents.forEach(content => {
      if (content.getAttribute('data-product') === filter) {
        content.classList.remove('hidden')
      } else {
        content.classList.add('hidden')
      }
    });
  }
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterProducts(filter);
    });
  });

  //Табы
  const tabs = document.querySelectorAll('.tabs__title');

  if (tabs) {
    const contentsTabs = document.querySelectorAll('.tabs__body');
    const tabsScroll = document.querySelector('.tabs__scroll');
    const tabsNavigation = document.querySelector('.tabs__navigation');

    if (tabsScroll && tabsNavigation) {
      // Функция обновления классов скролла
      function updateScrollClasses() {
        const { scrollLeft, scrollWidth, clientWidth } = tabsScroll;

        // Добавляем небольшую погрешность (1px) для браузерных округлений
        const atStart = scrollLeft <= 1;
        const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

        tabsNavigation.classList.toggle('_at-start', atStart);
        tabsNavigation.classList.toggle('_at-end', atEnd);
      }

      // Инициализация при загрузке
      updateScrollClasses();

      // Обработчик скролла (с троттлингом для производительности)
      let isScrolling;
      tabsScroll.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          updateScrollClasses();
        }, 100);
      });

      // Также обновляем при ресайзе
      window.addEventListener('resize', updateScrollClasses);
    }

    // Переменная для отслеживания анимации скролла
    let scrollAnimationId = null;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tabs;

        // 1. Убираем активный класс у всех кнопок
        tabs.forEach(t => t.classList.remove('_tab-active'));

        // 2. Добавляем активный класс текущей кнопке
        tab.classList.add('_tab-active');

        // 3. Скрываем все блоки с контентом
        contentsTabs.forEach(content => {
          content.classList.remove('_tab-active');
        });

        // 4. Показываем нужный блок
        const activeContent = document.querySelector(`[data-tabs-content="${targetTab}"]`);
        if (activeContent) {
          activeContent.classList.add('_tab-active');
        }

        // 5. Прокручиваем к активной вкладке (центрируем на мобильных)
        if (window.innerWidth < 767 && tabsScroll) {
          const nav = tabsScroll;
          const tabRect = tab.getBoundingClientRect();
          const navRect = nav.getBoundingClientRect();

          // Если контейнер уже в начале/конце, не центрируем крайние вкладки
          const atStart = tabsNavigation?.classList.contains('_at-start');
          const atEnd = tabsNavigation?.classList.contains('_at-end');
          const isFirstTab = tab === tabs[0];
          const isLastTab = tab === tabs[tabs.length - 1];

          if ((atStart && isFirstTab) || (atEnd && isLastTab)) {
            return; // Не скроллим, если вкладка уже у края
          }

          // Если вкладка уже видна (левая или правая часть), не скроллим
          const isVisible = (
            tabRect.left >= navRect.left &&
            tabRect.right <= navRect.right
          );

          if (!isVisible) {
            const scrollLeft = tab.offsetLeft - (nav.offsetWidth / 2) + (tab.offsetWidth / 2);
            const maxScroll = nav.scrollWidth - nav.offsetWidth;
            const clampedScroll = Math.max(0, Math.min(scrollLeft, maxScroll));

            // Отменяем предыдущую анимацию
            if (scrollAnimationId) {
              cancelAnimationFrame(scrollAnimationId);
            }

            nav.scrollTo({
              left: clampedScroll,
              behavior: 'smooth'
            });

            // Ждем завершения анимации скролла
            const checkScrollEnd = () => {
              const currentScroll = nav.scrollLeft;
              if (Math.abs(currentScroll - clampedScroll) > 5) { // Допуск 5px
                scrollAnimationId = requestAnimationFrame(checkScrollEnd);
              } else {
                if (tabsNavigation) {
                  updateScrollClasses();
                }
                scrollAnimationId = null;
              }
            };

            // Первая проверка после небольшой задержки
            setTimeout(() => {
              checkScrollEnd();
            }, 100);
          }
        }
      });
    });
  }

  //Фильтр
  const filterMob = document.querySelector('.block-catalog-detail__filter-mob');
  const filterPanel = document.querySelector('.filter-catalog-detail');
  const filterCloseBtn = document.querySelector('.filter-catalog-detail__close');
  const htmlElement = document.documentElement;

  if (!filterMob || !filterPanel) return;

  // Открытие фильтра
  filterMob.addEventListener('click', function (e) {
    e.stopPropagation();
    htmlElement.classList.add('filter-open');
    filterPanel.classList.add('filter-open');
  });

  // Закрытие по кнопке
  if (filterCloseBtn) {
    filterCloseBtn.addEventListener('click', function () {
      htmlElement.classList.remove('filter-open');
      filterPanel.classList.remove('filter-open');
    });
  }

  // Закрытие при клике вне области фильтра
  document.addEventListener('click', function (e) {
    const isClickInsideFilter = filterPanel.contains(e.target);
    const isClickOnFilterMob = filterMob === e.target || filterMob.contains(e.target);

    if (!isClickInsideFilter && !isClickOnFilterMob) {
      htmlElement.classList.remove('filter-open');
      filterPanel.classList.remove('filter-open');
    }
  });



  let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout((() => {
        target.hidden = !showmore ? true : false;
        !showmore ? target.style.removeProperty("height") : null;
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        !showmore ? target.style.removeProperty("overflow") : null;
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(new CustomEvent("slideUpDone", {
          detail: {
            target
          }
        }));
      }), duration);
    }
  };
  let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.hidden = target.hidden ? false : null;
      showmore ? target.style.removeProperty("height") : null;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout((() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(new CustomEvent("slideDownDone", {
          detail: {
            target
          }
        }));
      }), duration);
    }
  };
  let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
  };

  //Спойлеры
  function spollers() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {
      const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
      }));
      if (spollersRegular.length) initSpollers(spollersRegular);
      function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach((spollersBlock => {
          spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
          if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add("_spoller-init");
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener("click", setSpollerAction);
          } else {
            spollersBlock.classList.remove("_spoller-init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        }));
      }
      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
        if (spollerTitles.length) {
          spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
          spollerTitles.forEach((spollerTitle => {
            if (hideSpollerBody) {
              spollerTitle.removeAttribute("tabindex");
              if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.setAttribute("tabindex", "-1");
              spollerTitle.nextElementSibling.hidden = false;
            }
          }));
        }
      }
      function setSpollerAction(e) {
        const el = e.target;
        if (el.closest("[data-spoller]")) {
          const spollerTitle = el.closest("[data-spoller]");
          const spollersBlock = spollerTitle.closest("[data-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
            spollerTitle.classList.toggle("_spoller-active");
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
          }
          e.preventDefault();
        }
      }
      function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
          spollerActiveTitle.classList.remove("_spoller-active");
          _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        }
      }
      const spollersClose = document.querySelectorAll("[data-spoller-close]");
      if (spollersClose.length) document.addEventListener("click", (function (e) {
        const el = e.target;
        if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
          const spollersBlock = spollerClose.closest("[data-spollers]");
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
          spollerClose.classList.remove("_spoller-active");
          _slideUp(spollerClose.nextElementSibling, spollerSpeed);
        }));
      }));
    }
  }
  spollers()

  //Ползунок
  function rangeInit() {
    const ratingSearch = document.querySelector('.filter-catalog-detail__range');
    if (ratingSearch) {
      noUiSlider.create(ratingSearch, {
        start: [0, 165760],
        connect: true,
        range: {
          'min': [0],
          'max': [600000]
        },
        format: wNumb({
          decimals: 0,
          thousand: ' ',
        })
      });

      const priceStart = document.getElementById('price-start');
      const priceEnd = document.getElementById('price-end');
      priceStart.addEventListener('change', function () {
        ratingSearch.noUiSlider.set([this.value, null]);
      });
      priceEnd.addEventListener('change', function () {
        ratingSearch.noUiSlider.set([null, this.value]);
      });
      ratingSearch.noUiSlider.on('update', function (values, handle) {

        var value = values[handle];

        if (handle) {
          priceEnd.value = value;
        } else {
          priceStart.value = value;
        }
      });
    }
  };
  rangeInit();

});

//========================================================================================================================================================

