class AddAbbrToTeams < ActiveRecord::Migration
  def change
  	add_column :teams, :abbr, :string
  end
end
