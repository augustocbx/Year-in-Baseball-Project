class AddYearIdToTeams < ActiveRecord::Migration
  def change
  	add_column :teams, :year_id, :string
  end
end
