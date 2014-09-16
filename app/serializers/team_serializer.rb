class TeamSerializer < ActiveModel::Serializer
  attributes :id, :name, :city, :state, :league
end
