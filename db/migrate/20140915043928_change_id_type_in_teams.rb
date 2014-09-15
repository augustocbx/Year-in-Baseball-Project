class ChangeIdTypeInTeams < ActiveRecord::Migration
  def change
  	change_column :teams, :id, :string
  end
end
