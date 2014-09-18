class AddGamesBehindToDays < ActiveRecord::Migration
  def change
  	add_column :days, :games_behind, :float
  	add_column :days, :place, :integer
  end
end
