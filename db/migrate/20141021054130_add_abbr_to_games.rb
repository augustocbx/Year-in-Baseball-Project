class AddAbbrToGames < ActiveRecord::Migration
  def change
  	add_column :games, :team_home_abbr, :string
  	add_column :games, :team_visitor_abbr, :string
  end
end
