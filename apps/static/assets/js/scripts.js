

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





   // Fonction pour comparer la date sélectionnée avec la date actuelle
   function validateDateSelection() {
      // Récupérer la date actuelle
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // Mois est 0-indexé, donc +1
      const currentDay = today.getDate();
  
      // Récupérer les valeurs sélectionnées par l'utilisateur
      const selectedYear = parseInt(document.getElementById('annee').value);
      const selectedMonth = parseInt(document.getElementById('mois').value);
      const selectedDay = parseInt(document.getElementById('jour').value);
  
      // Comparer les dates : si la date choisie est antérieure à la date actuelle, réinitialiser la sélection
      if (
        (selectedYear < currentYear) ||
        (selectedYear === currentYear && selectedMonth < currentMonth) ||
        (selectedYear === currentYear && selectedMonth === currentMonth && selectedDay < currentDay)
      ) {
        alert("La date sélectionnée ne peut pas être antérieure à la date actuelle.");
        
        // Réinitialiser la sélection
        document.getElementById('jour').value = '';
        document.getElementById('mois').value = '';
        document.getElementById('annee').value = '';
      }
    }

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


    function formatPrice(input) {
        let value = input.value.replace(/\D/g, ""); // Enlève tout sauf les chiffres
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // Ajoute les séparateurs de milliers

        input.value = value;
    }
  
    // Ajouter un écouteur d'événements pour vérifier la date lorsque l'utilisateur sélectionne une option
    document.getElementById('jour').addEventListener('change', validateDateSelection);
    document.getElementById('mois').addEventListener('change', validateDateSelection);
    document.getElementById('annee').addEventListener('change', validateDateSelection);

   



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


// Fonction pour vérifier et masquer le bouton si nécessaire


// Add TRAJET
$(document).ready(function () {
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
          alert("An error occurred while submitting the form.");
      },
  });
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
    error: function (e) {
      $("#loading_trip").addClass("d-none");
      $(".modal-footer button").prop("disabled", false);
      alert("Une erreur est survenue."+e);
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



