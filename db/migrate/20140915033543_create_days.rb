class CreateDays < ActiveRecord::Migration
  def change
    create_table :days do |t|
      t.string :team_id
      t.string :game_id
      t.date :date
      t.integer :wins
      t.integer :losses
      t.integer :wins_over

      t.timestamps
    end
  end
end
