class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :season
      t.date :date
      t.string :game_id
      t.string :team_home_id
      t.string :team_visitor_id
      t.string :location
      t.integer :score_home
      t.integer :score_visitor
      t.string :stadium

      t.timestamps
    end
  end
end
