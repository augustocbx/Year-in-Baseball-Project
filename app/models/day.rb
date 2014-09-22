class Day < ActiveRecord::Base
	has_many :day_game_joins
	has_many :games, :through => :day_game_joins
	belongs_to :team
end
