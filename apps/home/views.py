
from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import redirect
from datetime import date
from datetime import time
from django.urls import reverse
from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from .models import Car
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Trip, ChatMessage
from django.contrib.auth.decorators import login_required
import json


""" 

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()

"""



@csrf_exempt  # Permet les requêtes POST AJAX
def add_car_ajax(request):
    if request.method == 'POST':
        matricule = request.POST.get('matricule')
        marque = request.POST.get('marque')
        modele = request.POST.get('modele')
        places = request.POST.get('place')
        age = request.POST.get('age')

        # Vérifier les données reçues
        if matricule and marque and modele and places and age:
            # Ajouter la voiture dans la base de données
            car = Car.objects.create(
                car_matricule=matricule,
                car_marque=marque,
                car_modele=modele,
                car_nombre_place=int(places),
                car_age=int(age),
                owner = request.user
            )
            car.save()

            # Retourner une réponse JSON
            return JsonResponse({"message": "Voiture ajoutée avec succès", "status": "success",
                'matricule': matricule,
                'marque': marque,
                'places': places,
            })
        else:
            return JsonResponse({"message": "Données invalides", "status": "error"})
    return JsonResponse({"message": "Requête non valide", "status": "error"})

@csrf_exempt  # Permet les requêtes POST AJAX
def add_trajet_ajax(request):
    if request.method == 'POST':
        source = request.POST.get('source')
        destination = request.POST.get('destination')
        prix = request.POST.get('prix')
        passagers = request.POST.get('passagers')
        places = request.POST.get('nombre_places')
        heure = request.POST.get('heure')
        minute = request.POST.get('minute')
        date = request.POST.get("date") 
        

        if heure and minute:
            complete_heure = time(int(heure), int(minute))    

        # Vérifier les données reçues
        if source and destination and prix and places and passagers and heure:
            # Ajouter la voiture dans la base de données
            trajet = Trajet.objects.create(
                source = source,
                destination = destination,
                price_per_seat = prix, 
                passengers_sex = passagers,
                bagage = request.user.bagage,
                date = date,
                heure = complete_heure,
                driver = request.user,
                places = places,
                status = "Lancé",
            )
            trajet.save()

            # Retourner une réponse JSON
            return JsonResponse({"message": "Trajet ajouté avec succès", "status": "success"})
        else:
            return JsonResponse({"message": "Données invalides", "status": "error"})
    return JsonResponse({"message": "Requête non valide", "status": "error"})

# add Trip function

@csrf_exempt  # Permet les requêtes POST AJAX
def add_trip_ajax(request):
    if request.method == 'POST':
        source = request.POST.get('source')
        destination = request.POST.get('destination')
        prix = request.POST.get('prix')
        driver = request.POST.get('driver')
        heure_min = request.POST.get('heure_min')
        heure_max = request.POST.get('heure_max')
        date = request.POST.get("date") 
        

        # Vérifier les données reçues
        if source and destination and prix and driver and heure_min and heure_max:
            # Ajouter la voiture dans la base de données
            trip = Trip.objects.create(
                passenger = request.user,
                source = source,
                destination = destination,
                driver_sexe = driver,
                price_max = prix,
                date = date,
                heure_min = heure_min,
                heure_max = heure_max,
                bagage = request.user.bagage
            )
            trip.save()

            # Retourner une réponse JSON
            return JsonResponse({"message": "Trip ajouté avec succès", "status": "success"})
        else:
            return JsonResponse({"message": "Données invalides", "status": "error"})
    return JsonResponse({"message": "Requête non valide", "status": "error"})



@login_required(login_url="/login/")
def index(request):

     # Objects for admin view =======================================================
    list_users = User.objects.all() 
    list_passenger = User.objects.filter(type = "Passenger")
    list_driver = User.objects.filter(type = "Driver")

    # End =====================================================================

    # Objects for users =======================================================
    trajets = Trajet.objects.filter(driver = request.user.id)
    trips = Trip.objects.filter(passenger = request.user.id)
    cars = Car.objects.filter(owner = request.user.id)
    user_cars = Car.objects.filter(owner=request.user)
    notification = Notification.objects.filter(user=request.user)

    user_bagage = request.user.bagage

    
    user_abonnement = request.user.abonnement

    abonnement = user_abonnement.date_expiration > date.today()
    
    no_car = False
    if not user_cars:
        # Si l'utilisateur n'a pas de voiture, afficher un message d'erreur
        no_car = True
        car_places = 0
        place_options = 0
    else:    
        car = user_cars.first()
        car_places = car.car_nombre_place
        # Passer cette information au template sous forme de liste
        place_options = list(range(1, car_places + 1))


    # End =====================================================================

    
    context = {'segment': 'index',
            "list_users": list_users,
            "list_passenger": list_passenger,
            "list_driver": list_driver,
            "trajets": trajets,
            "trips": trips,
            "cars": cars,
            "no_car": no_car,
            'car_places': car_places,
            'place_options': place_options,
            'user_bagage': user_bagage,
            'abonnement': abonnement,
            'user_abonnement': user_abonnement,
            'notification': notification,   
           
               }

    html_template = loader.get_template('home/profile.html')
    return HttpResponse(html_template.render(context, request))


@login_required(login_url="/login/")
def pages(request):

    trajets = Trajet.objects.filter(driver = request.user.id)
    trips = Trip.objects.filter(passenger = request.user.id)
    messages = ChatMessage.objects.all()

    context = {
        "trajets": trajets,
        "trips": trips,
        "messages": messages,
    }


    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:

        load_template = request.path.split('/')[-1]

        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        context['segment'] = load_template

        html_template = loader.get_template('home/' + load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:

        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))



@csrf_exempt
def update_bagage(request):
    if request.method == 'POST':
        bagage_type = request.POST.get('bagage')

        # Ensure bagage type is valid
        if not bagage_type:
            return JsonResponse({'status': 'error', 'message': 'Bagage type is required'}, status=400)

        # Update the user's bagage (assuming you have a user object)
        user = request.user
        user.bagage = bagage_type
        user.save()

        # Optionally, update the Trajet objects where the user is the driver
        Trajet.objects.filter(driver=user).exclude(status='complet').update(bagage=bagage_type)
        # Ooptionaly, update the Trip objects where the user is Passenger
        Trip.objects.filter(passenger=user).exclude(is_confirmed=True).update(bagage=bagage_type)


        return JsonResponse({'status': 'success', 'bagage': bagage_type})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
    



    

def match_trip_to_trajet(trip):
    
    # Essaie de trouver un trajet correspondant pour un trip donné.
    
    # Obtenez tous les trajets disponibles
    trajets = Trajet.objects.filter(
        source=trip.source,
        destination=trip.destination,
        date=trip.date,
        price_per_seat__lte=trip.price_max,  # Prix dans le budget
        is_full=False,  # Évitez les trajets complets
        bagage=trip.bagage,
    )
    
    # Filtrage supplémentaire basé sur l'heure et les préférences
    trajets = trajets.filter(
        heure__gte=trip.heure_min,  # L'heure du trajet doit être après `heure_min`
        heure__lte=trip.heure_max,  # L'heure doit être avant `heure_max`
        #driver__sex=trip.driver_sexe  # Filtrer par sexe du conducteur si nécessaire
    )
    
    
    if trajets.exists():
        trajet = trajets.first()  # Récupérer le premier trajet
        print(f"Avant mise à jour : places={trajet.places}, is_full={trajet.is_full}")

        # Mise à jour des informations du trajet avec update()
        trajet_update_count = trajets.filter(id=trajet.id).update(
            places=trajet.places - 1,
            is_full=(trajet.places - 1 == 0),
            status= "Complet" if (trajet.places - 1 == 0) else "Réservation en cours"

        )

        # Recharger l'objet trajet pour refléter les modifications
        trajet.refresh_from_db()

        print(f"Après mise à jour : places={trajet.places}, is_full={trajet.is_full}")

        if trajet_update_count > 0:
            print("Trajet mis à jour avec succès.")

        # Mise à jour des informations du trip
        trip.confirmed_price = trajet.price_per_seat
        trip.confirmed_heure = trajet.heure.strftime("%H:%M")
        trip.is_confirmed = True
        trip.trajet_id = trajet.id
        
        #Mettre la notification dans la base
        notification = Notification.objects.create(user=trip.passenger, content="Trip confirmé")

        trip.save()
        notification.save()
        print("Trip confirmé avec succès.")

        # Notifier les clients via Channels
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "matching_updates",
            {
                "type": "send_update",
                "data": {
                    "trip_id": trip.id,
                    "confirmed_price": trip.confirmed_price,
                    "confirmed_heure": trip.confirmed_heure,
                    "is_confirmed": trip.is_confirmed,
                    "trajet_id": trip.trajet_id,
                },
            },
        )

        return trajet





@receiver(post_save, sender=Trip)
def handle_new_trip(sender, instance, created, **kwargs):
    if created:
        match_trip_to_trajet(instance)


@receiver(post_save, sender=Trajet)
def handle_new_trajet(sender, instance, created, **kwargs):
    if created:
        # Vérifiez tous les trips non confirmés
        trips = Trip.objects.filter(
            source=instance.source,
            destination=instance.destination,
            date=instance.date,
            heure_min__lte=instance.heure,
            heure_max__gte=instance.heure,
            price_max__gte=instance.price_per_seat,
            bagage=instance.bagage,
            trajet_id=0,    #Tout trip avec champ trajet_id=0 n'est pas confirmé
            is_expired=False
        )
        for trip in trips:
            match_trip_to_trajet(trip)



# Django channel and notifications
def update_trip(trip_id):
    trip = Trip.objects.get(id=trip_id)
    channel_layer = get_channel_layer()

    # Envoyer les données mises à jour
    async_to_sync(channel_layer.group_send)(
        "trips_updates",
        {
            "type": "send_trip_update",
            "data": {
                "id": trip.id,
                "trajet_id": trip.trajet_id,
                "source": trip.source,
                "destination": trip.destination,
                "is_confirmed": trip.is_confirmed,
                "confirmed_price": trip.confirmed_price,
                "date": trip.date.strftime("%d %B %Y"),
                "heure_min": trip.heure_min.strftime("%H:%M"),
                "heure_max": trip.heure_max.strftime("%H:%M"),
            }
        }
    )



@login_required
def update_user_info(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        whatsapp = request.POST.get('whatsapp', '').strip()

        # Mise à jour des informations utilisateur
        user = request.user
        user.username = username
        user.email = email
        user.phone = phone  # Suppose que le champ phone est dans un modèle `Profile` relié à `User`
        user.whatsapp = whatsapp  # Idem pour whatsapp
        user.save()

        messages.success(request, "Vos informations ont été mises à jour avec succès !")
        return redirect('/paramettres.html')  # Redirigez vers une page de profil ou une autre page pertinente

    # Si la méthode n'est pas POST
    return render(request, 'paramettres.html')




@csrf_exempt
@login_required
def chat_view(request, trajet_id):
    trajet = get_object_or_404(Trajet, id=trajet_id)

    if request.method == "GET":
        # Récupérer les messages pour ce trajet
        messages = trajet.messages.order_by('timestamp').values('id', 'sender__username', 'message', 'timestamp')
        return JsonResponse(list(messages), safe=False)

    elif request.method == "POST":
        # Enregistrer un nouveau message
        data = json.loads(request.body)
        message = data.get('message', '').strip()

        if not message:
            return JsonResponse({'error': 'Message cannot be empty.'}, status=400)

        ChatMessage.objects.create(
            trajet=trajet,
            sender=request.user,
            message=message
        )
        return JsonResponse({'message': 'Message sent successfully.'})

    
