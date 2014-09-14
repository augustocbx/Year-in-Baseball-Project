class GamesController < ApplicationController

	respond_to :json

	def index
		@games = Game.all
		respond_with @games, each_serializer: GameSerializer
	end

end
