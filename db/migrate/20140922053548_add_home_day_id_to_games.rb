class AddHomeDayIdToGames < ActiveRecord::Migration
  def change
  	add_column :games, :home_day_id, :string
  	add_column :games, :visitor_day_id, :string
  end
end
