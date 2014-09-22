class Game < ActiveRecord::Base
	has_many :day_game_joins
	has_many :days, :through => :day_game_joins
end
