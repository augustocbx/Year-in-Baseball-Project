class GameSerializer < ActiveModel::Serializer
  attributes :season, :date, :game_id, :team_home_id, :team_visitor_id, :location, :score_home, :score_visitor, :stadium
end
