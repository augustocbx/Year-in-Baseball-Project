class DaysController < ApplicationController

	respond_to :json	

	def index
		@teams = Team.all
		respond_with @teams, each_serializer: DaySerializer
	end

end
