require('dotenv').config();
const apiKeyMapbox = process.env.API_KEY_MAPBOX;

mapboxgl.accessToken = apiKeyMapbox;

document.querySelector("[activity-data='image']").removeAttribute('srcset');
document.querySelector("[activity-data='liked']").removeAttribute('srcset');

// Function to find activity by ID in the data store
function findActivityByIdInDataStore(dataStore, relatedActivityId) {
  for (const guide of dataStore._guide_of_trips) {
    for (const activity of guide._guide_recommendations) {
      if (activity.id === relatedActivityId) {
        return activity;
      }
    }
  }
  return null;
}

async function renderRelatedActivities(activityId, destinationId, dataStore) {
  console.log('destination id', destinationId);
  console.log('activityId', activityId);
  console.log('datastoreeeee', dataStore);
  console.log('guide.id', dataStore._guide_of_trips[0].id);
  // Step 1: Find the destination in _guide_of_trips by its id
  const targetDestination = dataStore._guide_of_trips.find(
    (guide) => String(guide.id) === destinationId
  );

  console.log('Target dest', targetDestination);

  // Step 2: If the destination is found, then filter out activities that are not the current one
  let relatedActivities = [];
  if (targetDestination && targetDestination._guide_recommendations) {
    relatedActivities = targetDestination._guide_recommendations.filter(
      (activity) => activity._place.place_id !== activityId
    );
  }

  console.log('Related Activities', relatedActivities);

  // Step 3: Randomly pick 5 activities
  const randomActivities = [];
  while (randomActivities.length < 5 && relatedActivities.length > 0) {
    const randomIndex = Math.floor(Math.random() * relatedActivities.length);
    const randomActivity = relatedActivities.splice(randomIndex, 1)[0];
    randomActivities.push(randomActivity);
  }

  console.log('Randomactivities', randomActivities);
  // Step 4: Render these in HTML
  const relatedActivitiesContainer = document.querySelector("[activity-data='related-activity']");

  relatedActivitiesContainer.innerHTML = ''; // Clear the container before appending new elements

  randomActivities.forEach((activity) => {
    const activityElement = document.createElement('div');
    activityElement.className = 'mini-card_component is-related-activity';
    activityElement.setAttribute('related-activity-id', activity.place_id);

    const place = activity._place;

    // Image wrapper with margin
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'margin-bottom margin-xsmall';

    const image = document.createElement('img');
    image.src = place.oa_place_image.url;
    image.className = 'mini-card_image';
    imageWrapper.appendChild(image);

    activityElement.appendChild(imageWrapper);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'mini-card_content';

    // Activity name with margin
    const activityNameWrapper = document.createElement('div');
    activityNameWrapper.className = 'margin-bottom margin-xxsmall';

    const activityNameDiv = document.createElement('div');
    activityNameDiv.className = 'text-weight-bold';
    activityNameDiv.innerText = place.google_name;

    activityNameWrapper.appendChild(activityNameDiv);
    contentWrapper.appendChild(activityNameWrapper);

    // Category with margin
    const categoryWrapper = document.createElement('div');
    categoryWrapper.className = 'margin-bottom margin-xxsmall';

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'mini-card_tag-wrapper';
    categoryDiv.innerHTML = `<img src="${place._place_category.category_icon.url}" class="mini-card_tag-icon">
                              <div class="text-size-small text-color-grey">${place._place_category.category_name}</div>`;

    categoryWrapper.appendChild(categoryDiv);
    contentWrapper.appendChild(categoryWrapper);

    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating-stars_component';

    const rating = Math.floor(activity._place.google_rating); // Floor the rating to the nearest integer
    for (let i = 1; i <= 5; i++) {
      const starImage = document.createElement('img');
      starImage.className = `activity-star`;
      starImage.setAttribute('activity-data', `star-${i}`);

      if (i <= rating) {
        starImage.src =
          'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg';
      } else {
        starImage.src =
          'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg';
      }

      ratingDiv.appendChild(starImage);
    }
    contentWrapper.appendChild(ratingDiv);

    activityElement.appendChild(contentWrapper);

    // Add click event to fly to the related activity destination
    activityElement.addEventListener('click', function () {
      const relatedActivityId = this.getAttribute('related-activity-id');

      // Find the entire relatedActivity object
      const relatedActivity = findActivityByIdInDataStore(dataStore, relatedActivityId);

      if (relatedActivity) {
        // Function to fly to the destination using the relatedActivity
        flyToAndSetActive(relatedActivity.coords); // Assuming relatedActivity has a 'coords' field
      } else {
        console.warn(`Activity with ID ${relatedActivityId} not found.`);
      }
    });

    relatedActivitiesContainer.appendChild(activityElement);
  });
}

const markersMap = [];

function updateMarkerFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('activity_id');

  // Reset all markers to default appearance
  Object.values(markersMap).forEach((marker) => {
    marker.style.border = '2px solid grey';
  });

  // If activity_id is found in URL, change corresponding marker's appearance
  if (activityId && markersMap[activityId]) {
    markersMap[activityId].style.border = '2px solid purple';
  }
}

async function showActivityModal(activityId, dataStore) {
  const clickedGuide = dataStore._guide_of_trips.find((guide) =>
    guide._guide_recommendations.some(
      (activity) => activity.place_id.toString() === activityId.toString() // Fixed comparison
    )
  );

  const clickedActivity = clickedGuide?._guide_recommendations.find(
    (activity) => activity.place_id.toString() === activityId.toString() // Fixed comparison
  );

  if (!clickedActivity) {
    console.log('Activity data is missing');
    return;
  }

  document.querySelector("[activity-data='activity_description']").textContent =
    clickedActivity._place._place_category.category_name || 'No description available.';

  // Assuming clickedActivity._place._favorite_of_user_of_place is an array of objects
  const foundObject = clickedActivity._place._favorite_of_user_of_place.find(
    (favorite) => favorite.place_id === clickedActivity.place_id
  );

  // If a matching place_id is found in _favorite_of_user_of_place array
  if (foundObject) {
    document
      .querySelector("[wized='activity_like_button']")
      .setAttribute('activity-data-id', foundObject.id);
  } else {
    // Optionally, remove the attribute if no match is found
    document.querySelector("[wized='activity_like_button']").removeAttribute('activity-data-id');
  }

  document.querySelector("[activity-data='image']").src = clickedActivity._place.oa_place_image.url;

  document.querySelector("[activity-data='title']").innerText = clickedActivity._place.google_name;
  document.querySelector("[activity-data='category_icon']").src =
    clickedActivity._place._place_category.category_icon.url;

  document.querySelector("[activity-data='address']").innerText =
    clickedActivity._place.google_address_string;
  document.querySelector("[activity-data='phone_number']").innerText =
    clickedActivity._place.google_phone_number;
  document.querySelector("[activity-data='instagram_name']").innerText =
    clickedActivity._place.instagram_url;
  document.querySelector("[activity-data='place_url']").href =
    clickedActivity._place.google_place_url;
  document.querySelector("[activity-data='place_url']").innerText =
    clickedActivity._place.place_url; // or any text you want for the hyperlink
  document.querySelector("[activity-data='sub_title']").innerText = clickedActivity.note; // Assuming 'note' is the subtitle
  document.querySelector("[activity-data='activity_category']").innerText =
    clickedActivity._place.oa_category;

  function cleanDestinationName(name) {
    // Eerst verwijderen we alles na een underscore
    const cleanedFromUnderscore = name.split('_')[0];

    // Vervolgens verwijderen we alles na dubbele spaties
    const cleanedFromDoubleSpace = cleanedFromUnderscore.split('  ')[0];

    return cleanedFromDoubleSpace;
  }

  const destinationName = clickedActivity._place._destination_activity.mobi_destination_name;
  const cleanedDestinationName = cleanDestinationName(destinationName);

  document.querySelector("[activity-data='related-title']").innerText =
    'Other ' + cleanedDestinationName + ' activities';

  document.querySelector("[activity-data='activity_details_title']").innerText =
    clickedActivity._place.oa_category + ' Details';
  document.querySelector("[activity-data='activity_description']").innerText =
    clickedActivity._place.google_place_description;
  document.querySelector("[activity-data='instagram_url']").href =
    clickedActivity._place.instagram_url;
  document.querySelector("[activity-data='place_url_link']").href =
    clickedActivity._place.place_url;
  document.querySelector("[activity-data='directions']").href =
    clickedActivity._place.google_place_url;
  document.querySelector(
    "[activity-data='phone_number_link']"
  ).href = `tel:${clickedActivity._place.google_phone_number}`;
  document.querySelector("[activity-data='google_rating']").textContent =
    clickedActivity._place.google_rating;
  document.querySelector("[activity-data='oh_monday']").textContent = clickedActivity._place
    .google_monday_hours
    ? clickedActivity._place.google_monday_hours
    : 'Not added';

  document.querySelector("[activity-data='oh_tuesday']").textContent = clickedActivity._place
    .google_tuesday_hours
    ? clickedActivity._place.google_tuesday_hours
    : 'Not added';

  document.querySelector("[activity-data='oh_wednesday']").textContent = clickedActivity._place
    .google_wednesday_hours
    ? clickedActivity._place.google_wednesday_hours
    : 'Not added';

  document.querySelector("[activity-data='oh_thursday']").textContent = clickedActivity._place
    .google_thursday_hours
    ? clickedActivity._place.google_thursday_hours
    : 'Not added';

  document.querySelector("[activity-data='oh_friday']").textContent = clickedActivity._place
    .google_friday_hours
    ? clickedActivity._place.google_friday_hours
    : 'Not added';

  document.querySelector("[activity-data='oh_saturday']").textContent = clickedActivity._place
    .google_saturday_hours
    ? clickedActivity._place.google_saturday_hours
    : 'Not added';

  document.querySelector("[activity-data='oh_sunday']").textContent = clickedActivity._place
    .google_sunday_hours
    ? clickedActivity._place.google_sunday_hours
    : 'Not added';

  // Function or code block that initializes your modal
  // For demo, I am using a function but this could be part of your modal initialization code

  // Check if place is favorite (You need to replace this logic based on your data)
  const isFavorite = clickedActivity._place._favorite_of_user_of_place.some(
    (f) => f.place_id === clickedActivity.place_id
  );

  // Initialize likedElement globally for use in click event listener
  const likedElement = document.querySelector("[activity-data='liked']");

  // Set initial 'likedElement' src based on favorite status
  likedElement.src = isFavorite
    ? 'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/646356c55116c668dfccf4ae_heart-filled.svg'
    : 'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643568f2cf264582be96a5ce_heart.svg';

  const examples = document.querySelectorAll("[wized='activity_like_button']");

  examples.forEach((element) => {
    element.addEventListener('click', async function () {
      console.log('activity_like_button clicked');

      // Get the parent's activity-data-id attribute
      const parentId = element.getAttribute('activity-data-id');
      console.log('parent_id', parentId);

      if (likedElement) {
        const currentSrc = likedElement.getAttribute('src');
        console.log('Current src: ', currentSrc); // Debugging

        let wizedVarName;
        let wizedVarValue;

        if (
          currentSrc ===
          'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643568f2cf264582be96a5ce_heart.svg'
        ) {
          likedElement.setAttribute(
            'src',
            'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/646356c55116c668dfccf4ae_heart-filled.svg'
          );

          wizedVarName = 'add_favorite';
          wizedVarValue = clickedActivity.place_id; // Pass clickedActivity.place_id when adding favorite
        } else {
          likedElement.setAttribute(
            'src',
            'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643568f2cf264582be96a5ce_heart.svg'
          );

          wizedVarName = 'remove_favorite';
          wizedVarValue = parentId;
          console.log(wizedVarName, wizedVarValue); // Pass parentId when removing favorite
        }

        // Set wized variable
        await Wized.data.setVariable(wizedVarName, wizedVarValue);
      } else {
        console.log('likedElement is null or undefined'); // Debugging
      }
    });
  });

  const rating = Math.floor(clickedActivity._place.google_rating); // Floor the rating to the nearest integer

  for (let i = 1; i <= 5; i++) {
    const starElement = document.querySelector(`[activity-data='star-${i}']`);

    // Set star color based on rating
    if (i <= rating) {
      console.log(rating);

      starElement.setAttribute(
        'src',
        'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg'
      );
    } else {
      starElement.setAttribute(
        'src',
        'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg'
      );
    }
  }
  document.querySelector('[wized=activity_info_modal]').style.display = 'block';
}

// On load code

window.onload = async () => {
  document.querySelector('[wized=activity_info_modal]').style.display = 'none';

  console.log('Window loaded');

  Wized.request.awaitAllPageLoad(async () => {
    Wized.request.await('Load Trip Page');
    const dataStore = await Wized.data.get('r.18.d');
    const urlParams = new URLSearchParams(window.location.search);
    const destinationId = urlParams.get('destination_id');
    const activityId = urlParams.get('activity_id');

    const parentElement = document.querySelector('[wized="destination_nav"]');
    console.log('dataStore:', dataStore);

    dataStore._guide_of_trips.forEach((guide) => {
      const anchorElement = document.createElement('a');
      anchorElement.setAttribute('wized', 'destination_nav_id');
      anchorElement.setAttribute('href', '#');
      anchorElement.setAttribute('data-destination-id', guide.id);
      anchorElement.classList.add('mab_tabs-wrapper', 'w-inline-block');

      const paragraphElement = document.createElement('p');
      paragraphElement.setAttribute('wized', 'destination_nav_name');
      paragraphElement.setAttribute('data-destination-id', guide.id);
      paragraphElement.textContent = guide.place;
      paragraphElement.classList.add('map_tabs-link');

      anchorElement.appendChild(paragraphElement);
      parentElement.appendChild(anchorElement);

      renderRelatedActivities(activityId, destinationId, dataStore);

      // Add click event
      anchorElement.addEventListener('click', function () {
        console.log(`Clicked on destination ID: ${guide.id}, Place: ${guide.place}`);

        // Clear the activity_id from URL parameters
        urlParams.delete('activity_id');
        history.replaceState({}, '', `${location.pathname}?${urlParams}`);

        // Logic to update 'activeCoordinates' based on clicked 'guide.id'
        const newActiveCoordinates = coordinates.filter(
          (coord) => coord.destinationId === guide.id
        );

        setMapBounds(newActiveCoordinates, map);
      });
    });

    if (destinationId) {
      document.querySelectorAll('[data-destination-id]').forEach((el) => {
        // Remove 'is-active' class from all elements first
        el.classList.remove('is-active');

        // Check if this element's data-destination-id attribute matches destinationId
        if (el.getAttribute('data-destination-id') === destinationId) {
          console.log('tried adding class');
          // Add 'is-active' class
          el.classList.add('is-active');
        }
      });

      // 1. Set is-active class on click of a destination in nav [data-destination-id]
      document.querySelectorAll('[data-destination-id]').forEach((item) => {
        item.addEventListener('click', function (e) {
          // Remove is-active class from all nav items
          document
            .querySelectorAll('[data-destination-id]')
            .forEach((el) => el.classList.remove('is-active'));

          // Add is-active class to the clicked item
          e.currentTarget.classList.add('is-active');

          // Hide the modal with ID 'activity_info_modal'
          const modal = document.querySelector("[wized='activity_info_modal']");
          if (modal) {
            modal.style.display = 'none';
          }
        });
      });
    }

    const closestElements = document.querySelectorAll(`[wized="destination_nav"]`); // Selecteer alle elementen met wized="destination_nav"

    closestElements.forEach((element) => {
      console.log(closestElements);
      // Loop door elk element heen
      const dataDestinationId = element.getAttribute('data-destination-id'); // Haal de data-destination-id op van het huidige element

      if (dataDestinationId === destinationId) {
        // Check of deze gelijk is aan destinationId
        element.classList.add('is-active'); // Zo ja, voeg de klasse 'is-active' toe
      } else {
        element.classList.remove('is-active'); // Zo nee, verwijder de klasse (optioneel)
      }
    });

    if (activityId) {
      // Automatically open the modal if activity_id is present in the URL parameters
      showActivityModal(activityId, dataStore);
    }

    let startingPoint = [0, 0];
    if (destinationId) {
      for (const guide of dataStore._guide_of_trips) {
        if (guide.id.toString() === destinationId) {
          const destination = guide._destination && guide._destination[0];
          startingPoint = [destination.mobi_lng, destination.mobi_lat];
          break;
        }
      }
    } else {
      const firstGuideOfTrip = dataStore._guide_of_trips[0];
      const firstDestination = firstGuideOfTrip._destination && firstGuideOfTrip._destination[0];
      startingPoint = [firstDestination.mobi_lng, firstDestination.mobi_lat];
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: startingPoint,
      zoom: 17,
    });

    let activeMarker = null; // Initialize activeMarker outside of map.on("load")

    function flyToAndSetActive(place) {
      console.log('Fly to place', place);

      const offsetInRem = 20;
      const offsetInPixels = offsetInRem * 16; // Convert rem to pixels, assuming 1 rem = 16px

      map.flyTo({
        center: [place.google_lng, place.google_lat],
        zoom: 15,
        offset: [offsetInPixels, 0], // Adding the offset here
      });

      const newActiveMarker = document.querySelector(`[marker_activity_id="${place.place_id}"]`);

      if (newActiveMarker) {
        newActiveMarker.style.border = '2px solid purple';
        activeMarker = newActiveMarker;
      }
    }
    // Listen for clicks on elements with data-destination-id attribute
    document.querySelectorAll('[data-destination-id]').forEach((item) => {
      item.addEventListener('click', function () {
        // Remove is-active class from all destination nav items
        document.querySelectorAll('[data-destination-id]').forEach((el) => {
          el.classList.remove('is-active');
        });

        // Add is-active class to the clicked destination nav item
        this.classList.add('is-active');

        const destinationId = this.getAttribute('data-destination-id');
        console.log(`Destination ID clicked: ${destinationId}`); // Debugging log

        // Find the corresponding guide using the destinationId
        const guide = dataStore._guide_of_trips.find((g) => g.id.toString() === destinationId);

        console.log(dataStore._guide_of_trips);
        console.log(destinationId);

        if (guide) {
          const destination = guide._destination && guide._destination[0];
          if (destination) {
            // Collect the coordinates of all activities in this destination
            const destinationCoordinates = guide._guide_recommendations.map((recommendation) => {
              return [recommendation._place.google_lng, recommendation._place.google_lat];
            });

            // Set the bounds of the map to fit these coordinates
            setMapBounds(destinationCoordinates, map);

            // Update the URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('destination_id', destinationId);
            urlParams.delete('activity_id');
            history.replaceState({}, '', `${location.pathname}?${urlParams}`);
          }
        }
      });
    });

    // Function to calculate distance between two coordinates
    function distance(coord1, coord2) {
      const [x1, y1] = coord1;
      const [x2, y2] = coord2;
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Listen to map move event
    map.on('moveend', () => {
      const center = map.getCenter().toArray();
      console.log('Map moved, center is: ', center); // Log center coordinates

      let closestDestination = null;
      let minDistance = Infinity;

      // Find the closest destination
      dataStore._guide_of_trips.forEach((g) => {
        const destination = g;
        if (destination.id) {
          const destinationCenter = [
            destination._destination[0].mobi_lng,
            destination._destination[0].mobi_lat,
          ];

          console.log(destinationCenter);
          const d = distance(center, destinationCenter);
          console.log('Calculated distance: ', d); // Log the calculated distance

          if (d < minDistance) {
            minDistance = d;
            closestDestination = {
              id: destination.id, // Assuming `id` is the property you want
              mobi_lat: destination._destination[0].mobi_lat,
              mobi_lng: destination._destination[0].mobi_lng,
            };
            console.log('Updated closest destination: ', closestDestination); // Log the new closest destination
          }
        }
      });

      if (closestDestination) {
        console.log('Closest destination is: ', closestDestination); // Log the closest destination

        // Remove is-active class from all destination nav items
        document.querySelectorAll('[data-destination-id]').forEach((el) => {
          console.log('Removing is-active class from: ', el);
          el.classList.remove('is-active');
          // Log elements that should have the class removed
        });

        // Add is-active class to the closest destination nav item
        const closestElement = document.querySelector(
          `[data-destination-id="${closestDestination.id}"]`
        );
        if (closestElement) {
          console.log('Adding is-active class to: ', closestElement); // Log the element that should have the class added
          closestElement.classList.add('is-active');
        } else {
          console.log(`No element found for destination_id: ${closestDestination}`); // Log if no element is found
        }
      } else {
        console.log('No closest destination found'); // Log if no closest destination is found
      }
    });

    // End Moovend code

    // Mapbox Control code

    map.addControl(new mapboxgl.NavigationControl());

    function createMarker(activity, map, activeMarker) {
      // Create a marker
      const place = activity._place;
      console.log('Marker added at:', place.google_lng, place.google_lat);

      if (!place) return null;

      const imageUrl = place._place_category.category_icon.url;
      const markerHtml = document.createElement('div');
      markerHtml.style.backgroundImage = `url("${imageUrl}")`;
      //markerHtml.setAttribute("src", imageUrl);
      markerHtml.setAttribute('marker_activity_id', activity.place_id);
      markerHtml.style.backgroundRepeat = 'no-repeat';
      markerHtml.style.backgroundPosition = 'center';
      markerHtml.style.backgroundSize = '18px 18px';
      markerHtml.style.width = '41px';
      markerHtml.style.height = '25px';
      markerHtml.style.borderRadius = '12.5px';
      markerHtml.style.backgroundColor = 'var(--primary-white, #FFF)';
      markerHtml.style.boxShadow = '0px 4px 4px 0px rgba(35, 16, 94, 0.10)';
      markerHtml.style.border = '2px solid grey';

      const marker = new mapboxgl.Marker(markerHtml)
        .setLngLat([place.google_lng, place.google_lat])
        .addTo(map);

      const popupHTML = `
        <div class="mini-card_component .is-popup">
        <img src="${place.oa_place_image.url}" alt="" class="mini-card_image">
        <div class="mini-card_content">
        <div class="margin-bottom margin-xxsmall">
        <div class="text-weight-bold">${place.google_name}</div>
        </div>
        <div class="margin-bottom margin-xsmall">
        <div class="mini-card_tag-wrapper">
        <img src="${
          place._place_category.category_icon.url
        }" loading="lazy" alt="" class="mini-card_tag-icon">
        <div class="text-size-small text-color-grey">${
          place._place_category.category_name || 'No description available.'
        }</div>
        </div>
        </div>
        <div class="rating-stars_component">
        <img id="popup-star-1" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-2" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-3" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-4" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        <img id="popup-star-5" src="https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg" loading="lazy" alt="">
        </div>
        </div>
        <img loading="lazy" alt="" class="popup-card_arrow">
        </div>
        `;

      const popupInstance = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(popupHTML);

      // Rating logic
      popupInstance.on('open', () => {
        const rating = Math.floor(place.google_rating);
        for (let i = 1; i <= 5; i++) {
          const starElement = popupInstance._content.querySelector(`#popup-star-${i}`);
          if (starElement) {
            starElement.src =
              i <= rating
                ? 'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cbcc2d93ee2563a85e_star-blue.svg'
                : 'https://uploads-ssl.webflow.com/642d2be9a355e8eae598cfe4/643532cba4222a070cca9211_star-grey.svg';
          }
        }
      });

      map.on('click', () => {
        document.querySelector('[wized=activity_info_modal]').style.display = 'none';

        activeMarker = null;
        selectedMarker = null;
        // Delete the 'activity_id' parameter from URLSearchParams object
        urlParams.delete('activity_id');

        // Create a new URL object from the current URL
        const url = new URL(window.location.href);

        // Update the search parameters of the URL
        url.search = urlParams.toString();

        // Update the URL without reloading the page
        history.replaceState(null, null, url.toString());

        updateMarkerFromUrl();
      });

      // Event listeners
      markerHtml.addEventListener('mouseenter', () => {
        markerHtml.style.cursor = 'pointer';
        popupInstance.setLngLat(marker.getLngLat()).addTo(map);
      });

      markerHtml.addEventListener('mouseleave', () => {
        markerHtml.style.cursor = 'default';
        popupInstance.remove();
      });

      markerHtml.addEventListener('click', (e) => {
        e.stopPropagation();
        activeMarker = activity.id;
        selectedMarker = activity.place_id;

        urlParams.set('activity_id', activity.place_id);
        history.replaceState({}, '', `${location.pathname}?${urlParams}`);
        console.log(`Marker clicked with activity ID: ${activity.place_id}`);

        showActivityModal(activity.place_id, dataStore);
        updateMarkerFromUrl();
        flyToAndSetActive(place);
        renderRelatedActivities(activityId, destinationId, dataStore);
      });

      const closeButtons = document.querySelectorAll("[wized='activity_close_button']");

      closeButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
          console.log('Close clicked');
          document.querySelector('[wized=activity_info_modal]').style.display = 'none';

          // Delete the 'activity_id' parameter from URLSearchParams object
          urlParams.delete('activity_id');

          // Create a new URL object from the current URL
          const url = new URL(window.location.href);

          // Update the search parameters of the URL
          url.search = urlParams.toString();

          // Update the URL without reloading the page
          history.replaceState(null, null, url.toString());

          updateMarkerFromUrl();
        });
      });

      return markerHtml;
    }

    const coordinates = [];
    const activeCoordinates = [];
    var selectedMarker = null;

    map.on('load', function () {
      console.log('Map loaded');

      const urlParams = new URLSearchParams(window.location.search);
      const destination_id_param = urlParams.get('destination_id');
      const activity_id_param = urlParams.get('activity_id');

      let activityFound = false;

      dataStore._guide_of_trips.forEach((guide) => {
        console.log(`Processing guide ID: ${guide.id}`);

        const destinations = guide._guide_recommendations || [];

        destinations.forEach((destination) => {
          const place = destination._place;
          if (!place) return;

          console.log(`Adding coordinates: [${place.google_lng}, ${place.google_lat}]`);
          coordinates.push([place.google_lng, place.google_lat]);

          if (guide.id.toString() === destination_id_param) {
            activeCoordinates.push([place.google_lng, place.google_lat]);
          }

          const marker = createMarker(destination, map, activeMarker);

          if (marker) {
            activeMarker = marker;
            markersMap[place.id] = marker;
          }

          console.log('This is place', place);
          if (String(place.id) === activity_id_param) {
            activityFound = true; // Activity found based on ID
            flyToAndSetActive(place);
          }
        });
      });

      // Initial call to set the marker based on URL when the page loads
      updateMarkerFromUrl();

      // Listen to popstate event to catch URL changes without page reloads
      window.addEventListener('popstate', updateMarkerFromUrl);

      console.log(`Generated ${coordinates.length} coordinates`);
      console.log('Coordinates:', coordinates);

      // If activity_id parameter was present but no matching activity was found.
      if (activity_id_param && !activityFound) {
        console.log(`No activity found for ID: ${activity_id_param}`);
      }

      // If destination_id parameter was present, set the bounds accordingly.
      if (destination_id_param && !activityFound) {
        console.log(`Setting map bounds for destination_id: ${destination_id_param}`);
        setMapBounds(activeCoordinates, map);
      } else if (!activityFound) {
        console.log('No destination_id or activity_id found. Using default map settings.');
      }
    });

    function setMapBounds(coordinates, map) {
      if (!coordinates.length) return;
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
      );
      map.fitBounds(bounds, { padding: 60 });
    }
  });
};
