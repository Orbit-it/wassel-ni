

  function updateDestinationOptions() {
      const sourceSelect = document.getElementById('source');
      const destinationSelect = document.getElementById('destination');
      const selectedSource = sourceSelect.value;
      console.log(selectedSource);
      Array.from(destinationSelect.options).forEach(option => {
          option.disabled = option.value == selectedSource;
      });
  }
  
  function updateSourceOptions() {
      const sourceSelect = document.getElementById('source');
      const destinationSelect = document.getElementById('destination');
      const selectedDestination = destinationSelect.value;
      console.log(selectedDestination);
      Array.from(sourceSelect.options).forEach(option => {
          option.disabled = option.value == selectedDestination;
      });
  }


  // Fonction pour vérifier et masquer le bouton si nécessaire
  

  // Surveille l'ajout de voiture pour mettre à jour l'affichage du bouton
  $("#form_add_car").on("submit", function (e) {
    e.preventDefault(); // Empêche le rechargement de la page
    let url = $(this).data("url"); // Récupère l'URL du formulaire
    let formData = $(this).serialize(); // Sérialise les données du formulaire

    // Affiche l'animation de chargement
    $("#loading").removeClass("d-none");
    $(".modal-footer button").prop("disabled", true);

    // Effectue la requête AJAX
    $.ajax({
      type: "POST",
      url: url,
      data: formData,
      success: function (response) {
        $("#loading").addClass("d-none");

        if (response.status == "success") {

          $("#success").removeClass("d-none");
          $("#form_add_car").addClass("d-none");

          // Ajoute la nouvelle voiture à la liste
          const newCar = `
            <li class="list-group-item border-1 d-flex align-items-center px-0 mb-2 shadow-xl">
                 <div class="avatar me-1">
                    <img src="/static/assets/img/illustrations/rocket-dark.png" alt="Illustration" class="img-fluid border-radius-xl">
                  </div>
                <div class="d-flex align-items-start flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">${response.matricule}: ${response.marque}</h6>
                  <h5 class="mb-0 text-sm">Nombre de Place: ${response.places}</h5>
                </div>
              </li>
          `;
          $("#car_empty").addClass("d-none");
          $("#carDashboard").append(newCar);

          // Réinitialise le formulaire
          $("#form_add_car")[0].reset();

          // Appel de la fonction pour vérifier l'état du bouton après l'ajout
          checkCarCount();

          // Masque le modal après 3 secondes
          setTimeout(() => {
            $(".modal-footer button").prop("disabled", false);
            $("#addCar").removeClass("show").css("display", "none");
            $(".modal-backdrop").remove();
            $("#success").addClass("d-none");
          }, 3000);
        } else {
          alert(response.message);
        }
      },
      error: function () {
        $("#loading").addClass("d-none");
        $(".modal-footer button").prop("disabled", false);
        alert("Une erreur est survenue.");
      },
    });
  });





   // Fonction pour les heures min et max sélectionnée
   function validateHeureSelection() {
    
    // Récupérer les valeurs sélectionnées par l'utilisateur
    const selectedHeuremin = parseInt(document.getElementById('heure_min').value);
    const selectedHeuremax = parseInt(document.getElementById('heure_max').value);

    // Comparer les heures : si l'heure max choisie est antérieure à l'heure min choisie, réinitialiser la sélection
    if (
      (selectedHeuremax < selectedHeuremin)
    ) {
      alert("L'intervalle de l'heure de départ sélectionnée n'est pas valide, l'heure de debut doit être antérieure à l'heure de fin.");
      // Réinitialiser la sélection
      document.getElementById('heure_min').value = '';
      document.getElementById('heure_max').value = '';
    }
  }  

    // Ajouter un écouteur d'événements pour vérifier les heures min et max que l'utilisateur sélectionne
    document.getElementById('heure_min').addEventListener('change', validateHeureSelection);
    document.getElementById('heure_max').addEventListener('change', validateHeureSelection);





    // Fonction pour envoyer un message
    document.getElementById("sendMessageBtn").addEventListener("click", function() {
        var message = document.getElementById("messageInput").value;
        if (message.trim() === "") return; // Si le message est vide, ne rien faire

        var messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        // Déterminer si c'est un message du chauffeur ou d'un passager
        if (request.user.type == "Driver") {
            messageDiv.classList.add("driver");
        } else {
            messageDiv.classList.add("passenger");
        }

        messageDiv.textContent = message;
        document.getElementById("chatBox").appendChild(messageDiv);
        
        // Scroller vers le bas pour voir le dernier message
        document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
        
        // Effacer le champ de saisie après l'envoi
        document.getElementById("messageInput").value = "";
    });

    // Empêcher l'envoi de message si le champ est vide
    document.getElementById("messageInput").addEventListener("input", function() {
        var sendButton = document.getElementById("sendMessageBtn");
        if (this.value.trim() === "") {
            sendButton.disabled = true;
        } else {
            sendButton.disabled = false;
        }
    });


$('#chatModal').on('show.bs.modal', function () {
    $('body').addClass('modal-open');
});

$('#chatModal').on('hidden.bs.modal', function () {
    $('body').removeClass('modal-open');
});


// Relance TRAJET
$(document).on("click", ".relance-modal-trigger", function () {
  let trajetId = $(this).data("id"); // Get the ID from the button
  $("#form_relance_trajet").data("id", trajetId); // Set the ID in the specific form
});

$("#form_relance_trajet").on("submit", function (e) {
  e.preventDefault();
  let url = $(this).data("url");
  let id = $(this).data("id"); // Retrieve the dynamic ID
  let form_relance_trajet = $(this).serialize() + "&trajet_id=" + id;
  console.log(form_relance_trajet);
  $("#loading_relance_trajet").removeClass("d-none");
  $(".modal-footer button").prop("disabled", true);

  $.ajax({
      type: "POST",
      url: url,
      data: form_relance_trajet,
      success: function (response) {
          $("#loading_relance_trajet").addClass("d-none");
          if (response.status === "success") {
              $("#success_relance_trajet").removeClass("d-none");
              $("#form_relance_trajet")[0].reset();
              $("#form_relance_trajet").addClass("d-none");
              
              setTimeout(() => {
                  $(".modal-footer button").prop("disabled", false);
                  $("#relanceTrajet").removeClass("show").css("display", "none");
                  $(".modal-backdrop").remove();
                  $("#success_relance_trajet").addClass("d-none");
                  location.reload();
              }, 3000);
          } else {
              alert("Error: " + response.message);
          }
      },
      error: function (xhr, status, error) {
          console.error("Error occurred:", { xhr, status, error });
          $("#loading_relance_trajet").addClass("d-none");
          $(".modal-footer button").prop("disabled", false);
          alert("An error occurred while submitting the form.");
      },
  });
});
// End of Relancing TRAJET

  // Add TRAJET
  $("#form_add_trajet").on("submit", function (e) {
    e.preventDefault();
    let url = $(this).data("url");
    let formData_trajet = $(this).serialize();
    console.log("Submitting form to:", url, "with data:", formData_trajet);
  
    $("#loading_trajet").removeClass("d-none");
    $(".modal-footer button").prop("disabled", true);
  
    $.ajax({
        type: "POST",
        url: url,
        data: formData_trajet,
        success: function (response) {
            console.log("Response received:", response);
            $("#loading_trajet").addClass("d-none");
            if (response.status === "success") {
                $("#success_trajet").removeClass("d-none");
                $("#form_add_trajet").addClass("d-none");
                $("#trajet_empty").addClass("d-none");
                $("#form_add_trajet")[0].reset();
                setTimeout(() => {
                    $(".modal-footer button").prop("disabled", false);
                    $("#addTrajet").removeClass("show").css("display", "none");
                    $(".modal-backdrop").remove();
                    $("#success_trajet").addClass("d-none");
                    location.reload("#trip_dashboard");
                }, 3000);
            } else {
                alert("Error: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error occurred:", { xhr, status, error });
            $("#loading_trajet").addClass("d-none");
            $(".modal-footer button").prop("disabled", false);
            alert("Error lors de la soumission du formulaire.");
        },
    });
  });
  // End of Adding TRAJET
  
  // Add TRIP
  $("#form_add_trip").on("submit", function (e) {
    e.preventDefault(); // Empêche le rechargement de la page
    let url = $(this).data("url"); // Récupère l'URL du formulaire
    let formData_trip = $(this).serialize(); // Sérialise les données du formulaire
  
    // Affiche l'animation de chargement
    $("#loading_trip").removeClass("d-none");
    $(".modal-footer button").prop("disabled", true);
    console.log(formData_trip);
    // Effectue la requête AJAX
    $.ajax({
      type: "POST",
      url: url,
      data: formData_trip,
      success: function (response) {
        $("#loading_trip").addClass("d-none");
        if (response.status == "success") {
          $("#form_add_trip")[0].reset();
          $("#form_add_trip").addClass("d-none");
          $("#success_trip").removeClass("d-none");
          
          // Masque le modal après 3 secondes
          setTimeout(() => {
            $(".modal-footer button").prop("disabled", false);
            $("#addTrip").removeClass("show").css("display", "none");
            $(".modal-backdrop").remove();
            $("#success_trip").addClass("d-none");
            location.reload();
          }, 3000);
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error occurred:", { xhr, status, error });
        $("#loading_trip").addClass("d-none");
        $(".modal-footer button").prop("disabled", false);
        alert("Une erreur est survenue lors de la soumission du formulaire.");
      },
    });
  });
  // End of Adding TRIP

// Parametres des Bagages pour les Drivers
const bagageLeger = document.getElementById('bagage_leger');
const bagageStandard = document.getElementById('bagage_standard');

// Add event listener to the "Bagage Leger" checkbox
bagageLeger.addEventListener('change', function() {
    if (this.checked) {
        // Uncheck the other checkbox if this one is checked
        bagageStandard.checked = false;
        // Send an AJAX request to update the database
    } else {
        // If unchecked, reset the other field
        bagageStandard.checked = true;
    }
});

// Add event listener to the "Bagage Standard" checkbox
bagageStandard.addEventListener('change', function() {
    if (this.checked) {
        // Uncheck the other checkbox if this one is checked
        bagageLeger.checked = false;
        // Send an AJAX request to update the databas
    } else {
        // If unchecked, reset the other field
        bagageLeger.checked = true;
    }
});

// Function to send AJAX request to update the database

document.querySelector('#bagage-form').addEventListener('change', function(event) {
  const formData = new FormData(this);

  fetch('/update-bagage/', {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);  // Handle the response here (e.g., update UI)
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

const currentUser = "{{ request.user.username }}"; // Si vous utilisez Django


document.addEventListener('DOMContentLoaded', function () {
    const chatLinks = document.querySelectorAll('.open-chat');
    const chatModal = document.getElementById('chatModal');
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const sourceModal = document.getElementById('sourceModal');
    const destinationModal = document.getElementById('destinationModal');
    const dateModal = document.getElementById('dateModal');
    const heureModal =document.getElementById('heureModal');
    const priceModal = document.getElementById('priceModal');

    let tripId = null;

    // Charger les messages depuis l'API
    function loadMessages() {
        if (!tripId) return;

        const chatApiUrl = `/chat/${tripId}/`;
        fetch(chatApiUrl)
            .then(response => response.json())
            .then(messages => {
                chatBox.innerHTML = ''; // Nettoyer avant de charger
                messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', msg.sender__username === currentUser ? 'passenger' : 'driver');
                    messageDiv.innerHTML = `
                        <div class="message-content">
                            <strong>${msg.sender__username}</strong>
                            <span style="font-size: 10px; color: white;">(${new Date(msg.timestamp).toLocaleString()})</span></br>
                            ${msg.message}
                        </div>
                    `;
                    chatBox.appendChild(messageDiv);
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            })
            .catch(error => console.error('Erreur lors du chargement des messages:', error));
    }

    // Envoyer un message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message || !tripId) return;

        const chatApiUrl = `/chat/${tripId}/`;
        fetch(chatApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Assurez-vous que cette fonction existe
            },
            body: JSON.stringify({ message })
        })
            .then(response => {
                if (response.ok) {
                    messageInput.value = '';
                    loadMessages();
                } else {
                    console.error('Échec de l\'envoi du message.');
                }
            })
            .catch(error => console.error('Erreur lors de l\'envoi du message:', error));
    }

    // Ajouter un événement sur le bouton envoyer
    sendMessageBtn.addEventListener('click', sendMessage);

    // Permettre l'envoi avec la touche Entrée
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Ouvrir le chat avec le bon tripId
    chatLinks.forEach(link => {
        link.addEventListener('click', function () {
            tripId = this.getAttribute('data-trip-id');
            chatModal.setAttribute('data-trip-id', tripId);
            const depart = this.getAttribute('data-depart');
            const destination = this.getAttribute('data-destination');
            const date = this.getAttribute('data-date');
            const heure = this.getAttribute('data-heure');
            const price = this.getAttribute('data-price');

            // Mettre à jour les éléments du modal
            sourceModal.textContent = depart;
            destinationModal.textContent = destination;
            dateModal.textContent = date;
            heureModal.textContent = heure;
            priceModal.textContent = price;

            loadMessages(); // Charger les messages pour ce tripId
        });
    });

    // Rafraîchir les messages automatiquement toutes les 5 secondes
    setInterval(loadMessages, 5000);
});

// Fonction pour récupérer le CSRF token (à adapter selon votre configuration)
function getCookie(name) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (let cookie of cookies) {
        if (cookie.startsWith(name + '=')) {
            return cookie.split('=')[1];
        }
    }
    return null;
}



const socket = new WebSocket('ws://localhost:8000/ws/trips/'); //@ip_server=18.205.117.236
const notificationSound = new Audio('./static/assets/notification.mp3');
const bell = document.querySelector('.notification-bell');	
	
notificationSound.oncanplaythrough = () => {
    console.log("Audio chargé et prêt à être joué.");
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("Message reçu:", data);

    if (data.is_confirmed) {
        // Play the notification sound
        notificationSound.play();

	bell.classList.add('ring');

        // Retirez la classe après quelques secondes pour réinitialiser
        setTimeout(() => {
            bell.classList.remove('ring');
        }, 5000);    

        // Add a new notification to the dropdown
        const notificationDropdown = document.querySelector('#notification-dropdown');
        const newNotification = document.createElement('a');
        newNotification.className = 'dropdown-item border-radius-md';
        newNotification.href = 'javascript:;';
        newNotification.innerHTML = `
            <div class="d-flex py-1 shadow-sm px-2">
	                <div class="avatar avatar-sm bg-gradient-success  me-3  my-auto">
                          <i class="fa fa-handshake me-1"></i>
                        </div>
                   <div class="d-flex flex-column justify-content-center style="width: 70%;"">
                    <h6 class="text-sm mb-1">
                        Trip Confirmé
                    </h6>
                    <p class="text-xs text-secondary mb-0">
                        <i class="fa fa-clock me-1"></i>
                        à l'instant
                    </p>
                </div>
            </div>
        `;

        // Prepend the new notification to the dropdown
        if (notificationDropdown) {
            notificationDropdown.prepend(newNotification);
        }
    }

    // Update the trip card as before
    const tripElement = document.querySelector(`#trip-${data.trip_id}`);
    if (tripElement) {
        const badge = tripElement.querySelector('.badge');
        if (badge) {
            badge.textContent = "Trip Confirmé";
            badge.className = `badge bg-gradient-success text-white py-2 px-3`;
        }

        const priceElement = tripElement.querySelector('.confirmed-price');
	const buttonElement = tripElement.querySelector('.modified_button');
	const searchIcon = tripElement.querySelector('.fa-search');
	const openChat = tripElement.querySelector('.open_chat');
        if (priceElement) {
            priceElement.textContent = `${data.confirmed_price} TND`;
	    buttonElement.classList.add('d-none');
	    searchIcon.classList.add('d-none');
	    openChat.classList.remove('d-none');	
        }

        const heureElement = tripElement.querySelector('.confirmed-heure');
        if (heureElement) {
            heureElement.textContent = `Départ confirmé: ${data.confirmed_heure}`;
        }
    }
};



socket.onerror = function(error) {
    console.error("WebSocket Error:", error);
};

socket.onclose = function() {
    console.log("WebSocket connection closed.");
};


