import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TripConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "trips_updates"
        # Rejoindre un groupe
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Quitter le groupe
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Si nécessaire, traiter les données reçues depuis le client
        pass

    async def send_trip_update(self, event):
        # Envoyer les données mises à jour au client
        data = event['data']
        await self.send(text_data=json.dumps(data))
