class CreateDayGameJoins < ActiveRecord::Migration
  def change
    create_table :day_game_joins do |t|
      t.string :game_id
      t.string :day_id

      t.timestamps
    end
  end
end
