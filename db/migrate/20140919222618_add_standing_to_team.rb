class AddStandingToTeam < ActiveRecord::Migration
  def change
  	add_column :teams, :standing, :integer
  end
end
