class TeamSerializer < ActiveModel::Serializer
  attributes :name, :city, :state, :league, :team_id
end
