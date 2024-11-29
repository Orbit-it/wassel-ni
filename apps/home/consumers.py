from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TripConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join groups
        await self.channel_layer.group_add("matching_updates", self.channel_name)
        await self.channel_layer.group_add("trips_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave groups
        await self.channel_layer.group_discard("matching_updates", self.channel_name)
        await self.channel_layer.group_discard("trips_updates", self.channel_name)

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def send_trip_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))

