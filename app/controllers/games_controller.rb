class GamesController < ApplicationController

	before_action :get_year

	respond_to :json

	def index
		@games = @year.games
		respond_with @games, each_serializer: GameSerializer
	end

private
	def get_year
		@year = Year.find(params[:year_id])
	end

end
