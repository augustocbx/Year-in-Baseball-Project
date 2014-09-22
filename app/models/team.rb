class Team < ActiveRecord::Base
	has_many :days
	has_many :games, :through => :days
end
