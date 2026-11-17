from app.patterns.observer import Observer


class RequestSubject:
    """Subject. Stores the item-request details and maintains the list of
    observers attached to it. When a lifecycle event occurs, it works out
    the message and the recipient, then notifies all attached observers."""

    def __init__(self, request_id: str, item_id: str, requester_id: str, owner_id: str, requester_name: str = ""):
        self.request_id = request_id
        self.item_id = item_id
        self.requester_id = requester_id
        self.owner_id = owner_id
        self.requester_name = requester_name
        self._observers: list[Observer] = []

    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)

    async def notify(self, event_type: str) -> None:
        if event_type == "request_created":
            recipient_id = self.owner_id
            message = f"{self.requester_name or 'A student'} requested your item."
        elif event_type == "request_accepted":
            recipient_id = self.requester_id
            message = "Your request has been accepted by the owner."
        elif event_type == "request_declined":
            recipient_id = self.requester_id
            message = "Your request has been declined by the owner."
        else:
            return

        for observer in self._observers:
            await observer.update(message, recipient_id)
