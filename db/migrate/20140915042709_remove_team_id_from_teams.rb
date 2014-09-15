class RemoveTeamIdFromTeams < ActiveRecord::Migration
  def change
  	remove_column :teams, :team_id, :string
  end
end
