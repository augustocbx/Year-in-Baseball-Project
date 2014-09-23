class EventsController < ApplicationController

	respond_to :json

	def index
		@events = Event.all
		respond_with @events, each_serializer: EventSerializer
	end
end
