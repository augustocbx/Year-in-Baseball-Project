class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :season
      t.date :date
      t.string :team_home_id
      t.string :team_visitor_id
      t.text :event
      t.string :type

      t.timestamps
    end
  end
end
