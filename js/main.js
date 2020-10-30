'use strict';

const PIN_Y_START = 130;
const PIN_Y_END = 630;
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;
const TITLES = [`Апартаменты с видом на гору`, `Уютная квартира в центре Токио`,
  `Просторная квартира для большой компании`];
const FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const REAL_ESTATE_TYPE = [`palace`, `flat`, `house`, `bungalo`];
const ROOMS = [1, 2, 3, 100];
const GUESTS_QUANTITY = [1, 2, 3];
const CHECK_TIMES = [`12:00`, `13:00`, `14:00`];
const DESCRIPTIONS = [`Уютные апартаменты в эклектичном стиле`,
  `Каждая вещь в этой квартире подобрана строго по древним канонам`, `Приезжайте, не пожалеете!`];
const ADS_QUANTITY = 8;

const fragment = document.createDocumentFragment();
const pagePins = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const adCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const featuresDictionary = {
  'flat': `Квартира`,
  'palace': `Дворец`,
  'house': `Дом`,
  'bungalo': `Бунгало`
};

const getRangeValue = function (from, to) {
  const range = to - from + 1;
  return Math.floor(Math.random() * range);
};

const getMapWidth = function () {
  return document.querySelector(`.map`).clientWidth;
};

const getXPinPosition = function () {
  return Math.floor(Math.random() * getMapWidth()) + PIN_WIDTH / 2;
};

const getYPinPosition = function () {
  const pointsRange = PIN_Y_END - PIN_Y_START + 1;
  const randomPoint = Math.floor(Math.random() * pointsRange) + PIN_HEIGHT;

  return randomPoint;
};

const getRandomValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

const getFeatures = function (features) {
  const flatFeature = [];

  for (let i = 0; i < getRangeValue(0, features.length); i++) {
    flatFeature[i] = features[i];
  }

  return flatFeature;
};

const getPhotos = function () {
  const photos = [];

  for (let i = 0; i < getRangeValue(1, 4); i++) {
    photos[i] = `http://o0.github.io/assets/images/tokyo/hotel` + (i + 1) + `.jpg`;
  }

  return photos;
};

const generateAdvertsArray = function () {
  const adverts = [];

  for (let i = 0; i < 8; i++) {
    adverts[i] = {
      'author': `img/avatars/user0` + (i + 1) + `.png`,
      'offer': {
        'title': getRandomValue(TITLES),
        'address': getXPinPosition() + ` ` + getYPinPosition(),
        'price': getRangeValue(1000, 10000),
        'type': getRandomValue(REAL_ESTATE_TYPE),
        'rooms': getRandomValue(ROOMS),
        'guests': getRandomValue(GUESTS_QUANTITY),
        'checkin': getRandomValue(CHECK_TIMES),
        'checkout': getRandomValue(CHECK_TIMES),
        'features': getFeatures(FEATURES),
        'description': getRandomValue(DESCRIPTIONS),
        'photos': getPhotos()
      },
      'location': {
        'x': getXPinPosition() + `px`,
        'y': getYPinPosition() + `px`
      }
    };
  }

  return adverts;
};

const createPin = function (adPin) {
  const pin = pinTemplate.cloneNode(true);

  pin.children[0].src = adPin.author;
  pin.children[0].alt = adPin.offer.title;
  pin.style.left = adPin.location.x;
  pin.style.top = adPin.location.y;

  return pin;
};

const addFeatures = function (features, adCard) {
  for (let i = 0; i < features.length; i++) {
    const feature = document.createElement(`li`);

    feature.classList.add(`popup__feature`, `popup__feature--` + features[i]);
    adCard.querySelector(`.popup__features`).appendChild(feature);
  }
};

const addPhotos = function (photos, adCard) {
  for (let i = 0; i < photos.length; i++) {
    const adPhoto = adCard.querySelector(`.popup__photos`).querySelector(`img`).cloneNode(true);

    adPhoto.src = photos[i];
    adCard.querySelector(`.popup__photos`).appendChild(adPhoto);
  }
};

const placeHousingTitle = function (title, adCard) {
  if (title) {
    adCard.querySelector(`.popup__title`).textContent = title;
  } else {
    adCard.querySelector(`.popup__title`).classList.add(`hidden`);
  }
};

const placeHousingAddres = function (address, adCard) {
  if (address) {
    adCard.querySelector(`.popup__text--address`).textContent = address;
  } else {
    adCard.querySelector(`.popup__text--address`).classList.add(`hidden`);
  }
};

const placeHousingPrice = function (price, adCard) {
  if (price) {
    adCard.querySelector(`.popup__text--price`).textContent = price + `₽/ночь`;
  } else {
    adCard.querySelector(`.popup__text--price`).classList.add(`hidden`);
  }
};

const placeHousingCapacity = function (rooms, guests, adCard) {
  switch (true) {
    case !!rooms !== false && !!guests !== false:
      adCard.querySelector(`.popup__text--capacity`).textContent = rooms + ` комнаты для ` +
        guests + ` гостей`;
      break;

    case !!rooms !== true && !!guests !== false:
      adCard.querySelector(`.popup__text--capacity`).textContent = `Для ` +
        guests + ` гостей`;
      break;

    case !!rooms !== false && !!guests !== true:
      adCard.querySelector(`.popup__text--capacity`).textContent = rooms + ` комнаты`;
      break;

    default:
      adCard.querySelector(`.popup__text--capacity`).classList.add(`hidden`);
  }
};

const placeHousingTimes = function (checkin, checkout, adCard) {
  switch (true) {
    case !!checkin !== false && !!checkout !== false:
      adCard.querySelector(`.popup__text--time`).textContent = `Заезд после ` + checkin +
        `, выезд до ` + checkout;
      break;

    case !!checkin !== true && !!checkout !== false:
      adCard.querySelector(`.popup__text--time`).textContent = `Выезд до ` + checkout;
      break;

    case !!checkin !== false && !!checkout !== true:
      adCard.querySelector(`.popup__text--time`).textContent = `Заезд после ` + checkin;
      break;

    default:
      adCard.querySelector(`.popup__text--time`).classList.add(`hidden`);
  }
};

const placeHousingType = function (type, adCard) {
  if (type) {
    adCard.querySelector(`.popup__type`).textContent = type;
  } else {
    adCard.querySelector(`.popup__type`).classList.add(`hidden`);
  }
};

const placeHousingFeatures = function (features, adCard) {
  const adCardFeatures = adCard.querySelectorAll(`.popup__feature`);

  for (let i = 0; i < adCardFeatures.length; i++) {
    adCardFeatures[i].remove();
  }

  if (features) {
    addFeatures(features, adCard);
  } else {
    adCard.querySelector(`.popup__type`).classList.add(`hidden`);
  }
};

const placeHousingDescription = function (description, adCard) {
  if (description) {
    adCard.querySelector(`.popup__description`).textContent = description;
  } else {
    adCard.querySelector(`.popup__description`).classList.add(`hidden`);
  }
};

const placeHousingPhotos = function (photos, adCard) {
  if (photos) {
    addPhotos(photos, adCard);
  } else {
    adCard.querySelector(`.popup__type`).classList.add(`hidden`);
  }
  adCard.querySelector(`.popup__photos`).querySelector(`img`).remove();
};

const placeAuthorAvatar = function (avatar, adCard) {
  if (avatar) {
    adCard.querySelector(`.popup__avatar`).src = avatar;
  } else {
    adCard.querySelector(`.popup__type`).classList.add(`hidden`);
  }
};

const createAdCard = function (ad) {
  const adCard = adCardTemplate.cloneNode(true);

  placeHousingTitle(ad.offer.title, adCard);
  placeHousingAddres(ad.offer.address, adCard);
  placeHousingPrice(ad.offer.price, adCard);
  placeHousingType(featuresDictionary[ad.offer.type], adCard);
  placeHousingCapacity(ad.offer.rooms, ad.offer.guests, adCard);
  placeHousingTimes(ad.offer.checkin, ad.offer.checkout, adCard);
  placeHousingFeatures(ad.offer.features, adCard);
  placeHousingDescription(ad.offer.description, adCard);
  placeHousingPhotos(ad.offer.photos, adCard);
  placeAuthorAvatar(ad.author, adCard);

  return adCard;
};

const createAds = function () {
  for (let i = 0; i < ADS_QUANTITY; i++) {
    fragment.appendChild(createPin(generateAdvertsArray()[i]));
  }
};

createAds();

document.querySelector(`.map`).classList.remove(`map--faded`);

pagePins.appendChild(fragment);

const map = document.querySelector(`.map`);
const mapFiltersContainer = document.querySelector(`.map__filters-container`);
map.insertBefore(createAdCard(generateAdvertsArray()[0]), mapFiltersContainer);
