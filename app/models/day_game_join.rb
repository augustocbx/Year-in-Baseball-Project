class DayGameJoin < ActiveRecord::Base
	belongs_to :day
	belongs_to :game
end
