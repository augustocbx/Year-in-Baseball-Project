class EventSerializer < ActiveModel::Serializer
  attributes :id, :date, :team_home_id, :team_visitor_id, :event, :event_type
end
