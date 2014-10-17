class Year < ActiveRecord::Base
	has_many :teams
	has_many :days, :through => :teams
	has_many :games
end
