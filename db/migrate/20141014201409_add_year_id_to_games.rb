class AddYearIdToGames < ActiveRecord::Migration
  def change
  	add_column :games, :year_id, :string
  end
end
