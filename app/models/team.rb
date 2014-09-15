class Team < ActiveRecord::Base
	has_many :days, foreign_key: "team_id"
end
