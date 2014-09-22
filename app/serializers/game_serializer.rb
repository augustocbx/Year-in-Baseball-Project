class GameSerializer < ActiveModel::Serializer
  attributes :season, :date, :id, :team_home_id, :team_visitor_id, :location, :score_home, :score_visitor, :stadium, :home_day_id, :visitor_day_id
end
