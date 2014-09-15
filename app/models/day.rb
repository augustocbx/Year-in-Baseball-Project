class Day < ActiveRecord::Base
	belongs_to :team, foreign_key: "team_id"
end
