class CreateTeams < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.text :city
      t.text :name
      t.text :league
      t.text :state
      t.text :team_id

      t.timestamps
    end
  end
end
