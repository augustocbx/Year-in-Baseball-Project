class RemoveGameIdFromTeams < ActiveRecord::Migration
  def change
  	remove_column :games, :game_id, :string
  end
end
